import Controller from '@ember/controller';
import { match, not } from '@ember/object/computed';
import { gte } from '@ember/object/computed';
import { and } from '@ember/object/computed';

//export default class ContactController extends Controller({
export default Controller.extend({

  headerMessage: 'Contact Us:',
  responseMessage: '',
  emailAddress: '',
  message: '',

  isValid: match('emailAddress', /^.+@.+\..+$/),
  isLongEnough: gte('message.length', 5),
  isDisabled: not('isValid', 'isLongEnough'),  
  isBothTrue: and('isValid', 'isLongEnough'),    

  actions: {

    sendMessage() {
      alert(`${this.get('emailAddress', 'message')}`);
      this.set('responseMessage', `We got your message and we’ll get in touch soon.`);
      this.set('emailAddress', '');
      this.set('message', '');
    }
  }
});