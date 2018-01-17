/* global GM_setValue GM_getValue GM_deleteValue */

// ==UserScript==
// @name         isaacs/github /contact xposter
// @namespace    https://github.com/ghes
// @version      0.1.1
// @description  tell isaacs/github what you just told GitHub Support
// @author       Stuart P. Bentley (@stuartpb)
// @match        https://github.com/support
// @match        https://github.com/contact
// @match        https://github.com/isaacs/github/issues/new
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

// Copyright Stuart P. Bentley.
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

function dlFormContaining(elem) {
  var dl = document.createElement('dl');
  dl.className = 'form';
  dl.appendChild(elem);
  return dl;
}

switch (location.href) {
  case 'https://github.com/support':
  case 'https://github.com/contact':
    var contactDiv = document.getElementById('contact-github');
    var pageContent = document.getElementsByClassName('page-content')[0];
    // if this is the pre-submission form
    if (contactDiv) {
      var submitForm = contactDiv.getElementsByTagName('form')[0];
      if (submitForm) submitForm.addEventListener('submit', function() {
          GM_setValue('subject_save',
            document.getElementById('form_subject').value);
          GM_setValue('body_save',
            document.getElementById('form_comments').value);
          GM_setValue('saving', true);
      });
    // if this is the post-submission page and we just saved a submission
    } else if (pageContent && GM_getValue('saving')) {
      // unpack the saves info form elements
      var subjectInput = document.createElement('input');
      subjectInput.type = 'text';
      subjectInput.className = 'input-block';
      subjectInput.value = GM_getValue('subject_save');
      var bodyInput = document.createElement('textarea');
      bodyInput.className = 'input-block';
      bodyInput.value = GM_getValue('body_save');
      var submitButton = document.createElement('button');
      submitButton.type = 'button';
      submitButton.className = 'button input-block';
      submitButton.textContent = 'Post to isaacs/github';
      submitButton.addEventListener('click',function(){
          GM_setValue('subject_save',subjectInput.value);
          GM_setValue('body_save',bodyInput.value);
          GM_setValue('saving', true);
          location.href = 'https://github.com/isaacs/github/issues/new';
      });
      pageContent.appendChild(dlFormContaining(subjectInput));
      pageContent.appendChild(dlFormContaining(bodyInput));
      pageContent.appendChild(submitButton);
      GM_deleteValue('subject_save');
      GM_deleteValue('body_save');
      GM_deleteValue('saving');
    }

    break;
  case 'https://github.com/isaacs/github/issues/new':
    if (GM_getValue('saving')) {
      // unpack the saves / pre-populate the input fields
      document.getElementById('issue_title').value =
        GM_getValue('subject_save');
      document.getElementById('issue_body').value =
        GM_getValue('body_save');
        GM_deleteValue('subject_save');
        GM_deleteValue('body_save');
        GM_deleteValue('saving');
    }
    break;
}
