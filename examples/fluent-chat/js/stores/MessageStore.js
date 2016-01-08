/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Fluent = require('fluent-js');
var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var ThreadStore = require('../stores/ThreadStore');

var _messages = {};

function _addMessages(rawMessages) {
  rawMessages.forEach(function(message) {
    if (!_messages[message.id]) {
      _messages[message.id] = ChatMessageUtils.convertRawMessage(
        message,
        ThreadStore.getCurrentID()
      );
    }
  });
}

function _markAllInThreadRead(threadID) {
  for (var id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }
}

class MessageStore extends Fluent.Store {

  get(id) {
    return _messages[id];
  }

  getAll() {
    return _messages;
  }

  /**
   * @param {string} threadID
   */
  getAllForThread(threadID) {
    var threadMessages = [];
    for (var id in _messages) {
      if (_messages[id].threadID === threadID) {
        threadMessages.push(_messages[id]);
      }
    }
    threadMessages.sort(function(a, b) {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  }

  getAllForCurrentThread() {
    return this.getAllForThread(ThreadStore.getCurrentID());
  }

}

var actionHandlers = {

  viewActionHandlers: {

    clickThread(threadID) {
      this.waitFor([ThreadStore]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
    },

    createMessage(text, currentThreadID) {
      var message = ChatMessageUtils.getCreatedMessageData(
        text,
        currentThreadID
      );
      _messages[message.id] = message;
    }

  },

  serverActionHandlers: {

    receiveAll(rawMessages) {
      _addMessages(rawMessages);
      this.waitFor([ThreadStore]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
    }

  }

};

module.exports = new MessageStore(ChatAppDispatcher, actionHandlers);
