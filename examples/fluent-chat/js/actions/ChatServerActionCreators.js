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

class ChatServerActions extends Fluent.Actions {

  receiveAll(rawMessages) {
    this.dispatch(rawMessages);
  }

  receiveCreatedMessage(createdMessage) {
    this.dispatch(createdMessage);
  }

}

module.exports = new ChatServerActions(ChatAppDispatcher, true);
