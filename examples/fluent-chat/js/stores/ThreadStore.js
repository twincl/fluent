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

var _currentID = null;
var _threads = {};

class ThreadStore extends Fluent.Store {

  init(rawMessages) {
    rawMessages.forEach(function(message) {
      var threadID = message.threadID;
      var thread = _threads[threadID];
      if (thread && thread.lastMessage.timestamp > message.timestamp) {
        return;
      }
      _threads[threadID] = {
        id: threadID,
        name: message.threadName,
        lastMessage: ChatMessageUtils.convertRawMessage(message, _currentID)
      };
    }, this);

    if (!_currentID) {
      var allChrono = this.getAllChrono();
      _currentID = allChrono[allChrono.length - 1].id;
    }

    _threads[_currentID].lastMessage.isRead = true;
  }

  /**
   * @param {string} id
   */
  get(id) {
    return _threads[id];
  }

  getAll() {
    return _threads;
  }

  getAllChrono() {
    var orderedThreads = [];
    for (var id in _threads) {
      var thread = _threads[id];
      orderedThreads.push(thread);
    }
    orderedThreads.sort(function(a, b) {
      if (a.lastMessage.date < b.lastMessage.date) {
        return -1;
      } else if (a.lastMessage.date > b.lastMessage.date) {
        return 1;
      }
      return 0;
    });
    return orderedThreads;
  }

  getCurrentID() {
    return _currentID;
  }

  getCurrent() {
    return this.get(this.getCurrentID());
  }

}

var actionHandlers = {

  viewActionHandlers: {

    clickThread(threadID) {
      _currentID = threadID;
      _threads[_currentID].lastMessage.isRead = true;
    }

  },

  serverActionHandlers: {

    receiveAll(rawMessages) {
      threadStore.init(rawMessages);
    }

  }

};

var threadStore = new ThreadStore(ChatAppDispatcher, actionHandlers);

module.exports = threadStore;
