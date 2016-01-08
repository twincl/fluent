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
var MessageStore = require('../stores/MessageStore');
var ThreadStore = require('../stores/ThreadStore');

class UnreadThreadStore extends Fluent.Store {

  getCount() {
    var threads = ThreadStore.getAll();
    var unreadCount = 0;
    for (var id in threads) {
      if (!threads[id].lastMessage.isRead) {
        unreadCount++;
      }
    }
    return unreadCount;
  }

}

var actionHandlers = {

  viewActionHandlers: {

    clickThread(threadID) {
      this.waitFor([ThreadStore, MessageStore]);
    }

  },

  serverActionHandlers: {

    receiveAll(rawMessages) {
      this.waitFor([ThreadStore, MessageStore]);
    }

  }

};

module.exports = new UnreadThreadStore(ChatAppDispatcher, actionHandlers);
