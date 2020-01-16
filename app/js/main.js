// Set domain for saved images

var imagePathUrl = 'http://pornhub.com/site/images/';

// Generate dummy content
var EmailContent;
(function () {

  EmailContent = function () {
    this.type = null;
    this.query = null;
    this.data = null;
  };
  EmailContent.IMAGE = 1;
  EmailContent.TEXT = 2;
  EmailContent.TYPE = {
    PARAGRAPH: 1,
    SENTENCE: 2,
    WORD: 3
  };
  EmailContent.WORDS = [
    "lorem", "ipsum", "dolor", "sit", "<a href='#'>link</a>", "amet,", "consectetur", "adipiscing", "elit", "ut", "aliquam,", "purus", "sit", "amet", "luctus", "venenatis,", "lectus", "<a href='#'>some longer link</a>", "magna", "fringilla", "urna,", "porttitor", "rhoncus", "dolor", "purus", "non", "enim", "praesent", "elementum", "facilisis", "leo,", "vel", "fringilla", "est", "ullamcorper", "eget", "nulla", "facilisi", "etiam", "dignissim", "diam", "quis", "enim", "lobortis", "scelerisque", "fermentum", "dui", "faucibus", "in", "ornare", "quam", "viverra", "orci", "sagittis", "eu", "volutpat", "odio", "facilisis", "mauris", "sit", "amet", "massa", "vitae", "tortor", "condimentum", "lacinia", "quis", "vel", "eros", "donec", "ac", "odio", "tempor", "orci", "dapibus", "ultrices", "in", "iaculis", "nunc", "sed", "augue", "lacus,", "viverra", "vitae", "congue", "eu,", "consequat", "ac", "felis", "donec", "et", "odio", "pellentesque", "diam", "volutpat", "commodo", "sed", "egestas", "egestas", "fringilla", "phasellus", "faucibus", "scelerisque", "eleifend", "donec", "pretium", "vulputate", "sapien", "nec", "sagittis", "aliquam", "malesuada", "bibendum", "arcu", "vitae", "elementum",
  ];
  EmailContent.prototype.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  EmailContent.prototype.createText = function (count, type) {
    switch (type) {
      case EmailContent.TYPE.PARAGRAPH:
        var paragraphs = [];
        for (var i = 0; i < count; i++) {
          var paragraphLength = this.randomInt(1, 2);
          var paragraph = this.createText(paragraphLength, EmailContent.TYPE.SENTENCE);
          paragraphs.push('<p>' + paragraph + '</p>');
        }
        return paragraphs.join('\n');
      case EmailContent.TYPE.SENTENCE:
        var sentences = [];
        for (var i = 0; i < count; i++) {
          var sentenceLength = this.randomInt(20, 2);
          var words = this.createText(sentenceLength, EmailContent.TYPE.WORD).split(' ');
          words[0] = words[0].substr(0, 1).toUpperCase() + words[0].substr(1);
          var sentence = words.join(' ');

          sentences.push(sentence);
        }
        return (sentences.join('. ') + '.');
      case EmailContent.TYPE.WORD:
        var wordIndex = this.randomInt(0, EmailContent.WORDS.length - count - 1);

        return EmailContent.WORDS.slice(wordIndex, wordIndex + count).join(' ').replace(/[\.\,]/g, '');
    }
  };
  EmailContent.prototype.createEmailContent = function (element) {

    var lorem = [];
    var count;

    if (/\d+-\d+[psw]/.test(this.query)) {
      var range = this.query.substring(0, this.query.length - 1).split("-");
      count = this.randomInt(parseInt(range[0]), parseInt(range[1]));
    } else {
      count = parseInt(this.query);
    }

    var typeInput = this.query[this.query.length - 1];
    if (typeInput == 'p') {
      var type = EmailContent.TYPE.PARAGRAPH;
    } else if (typeInput == 's') {
      var type = EmailContent.TYPE.SENTENCE;
    } else if (typeInput == 'w') {
      var type = EmailContent.TYPE.WORD;
    }

    lorem.push(this.createText(count, type));
    lorem = lorem.join(' ');

    if (element) {
      if (this.type == EmailContent.TEXT)
        element.innerHTML += lorem;
      else if (this.type == EmailContent.IMAGE) {
        //TODO: for now, using lorempixel.
        var path = '';
        var options = this.query.split(' ');
        if (options[0] == 'gray') {
          path += '/g';
          options.shift(); // Remove first element.
        }
        if (element.getAttribute('width'))
          path += '/' + element.getAttribute('width');

        if (element.getAttribute('height'))
          path += '/' + element.getAttribute('height');

        path += '/' + options.join(' ');
        element.src = 'http://lorempixel.com' + path;
      }
    }

    if (element == null) return lorem;
  };

  window.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[dummy]');
    for (var i in els) {
      if (els.hasOwnProperty(i)) {
        var lorem = new EmailContent;
        lorem.type = els[i].tagName == 'IMG' ? EmailContent.IMAGE : EmailContent.TEXT;
        lorem.query = els[i].getAttribute('dummy');
        lorem.createEmailContent(els[i]);
      }
    }
  });

})();
