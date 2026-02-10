(function () {
  'use strict';

  // --- State ---
  const state = {
    currentScreen: 'landing',
    currentQuestion: 1,
    score: 0,
    noClickCount: 0,
    lifelinesUsed: { phone: false, audience: false, hint: false },
    q2OptionsShown: null,
    q3OptionsShown: null
  };

  const NO_MESSAGES = [
    'Not this year',
    'The button says try again.',
    'I already booked.',
    'There is no escape.',
    "The No button is just for show.",
    "Fine, I'll eat your share.",
    "Your only way out is through Yes.",
    "I have patience. And a reservation.",
    "Last chance. (I'm not kidding.)",
    "Still no? Bold choice. Wrong one."
  ];

  const Q1_COLOUR_WRONG_MESSAGES = {
    black: "So close. That's my second favourite—you literally just missed it. Try again.",
    white: "How can a colourful person like me have white as her favourite? Tch. Try again.",
    pink: "Too girly. Think warmer—earth, not candy. Try again.",
    default: "Nope. Think warmer. Try again."
  };
  const Q2_ACCEPTED = ['tiamo', "tiamo's", 'tiamo bangalore', 'tiamo restaurant'];
  const Q2_HINT = "Pool view. Fancy pasta. I was wearing a top so pale, a ghost would've said 'twinsies.' The place? Italian name. Sounds like 'I love' in a hurry.";
  const Q3_HINT = "Think physical. Think first time we met. Not food.";
  const Q4_HINT = "Thankful.";
  const Q4_SCARF_MESSAGE = "Cute in hindsight. Back then I was like: okay, someone's trying to impress a girl. Wrong order.";
  const Q4_WRONG_MESSAGES = {
    scarf: Q4_SCARF_MESSAGE,
    jacket: "Thoughtful, but that was later. Think something we both had. Try again.",
    office: "Sweet, but wrong timeline. Think something. Same as mine. Try again.",
    default: "Wrong option, right person. Try again."
  };
  const Q5_WRONG_MESSAGES = {
    shows: "We do that too, but that's not THE one. Think needier. And cuter. Try again.",
    boardgames: "That's fun, but I'm talking about my favourite hobby—being impossible. Try again.",
    irritate: "That might compete for second place, but incorrect. Think baby. Literally. Try again.",
    default: "Nope. Think who gets to act like a toddler and get away with it. Try again."
  };
  const PHONE_FRIEND_MESSAGES = {
    q1: "You're calling your wife. She says: Think earth. Think chocolate. Think me. She hangs up.",
    q2: "You're calling your wife. She says: Think pool view. Think pasta. Think Italian. She's not giving you the name—you're supposed to remember.",
    q3: "You're calling your wife. She cut the call. You're supposed to know this one. No rescue mission.",
    q4: "You're calling your wife. She says: " + Q4_HINT,
    q5: "You're calling your wife. She says: Think baby. Think who acts like one. She hangs up."
  };
  const AUDIENCE_MESSAGES = {
    q1: "Audience poll: 100% say 'If you don't know her favourite colour, we have questions.' Nice try.",
    q2: "The audience is literally just us. I'm not giving you the answer—you were there. Think harder.",
    q3: "Ask the audience? The audience is your wife. She says: You should know this. The audience has left the building.",
    q4: "Audience poll: 100% say 'If you don't know, we have bigger problems than this quiz.' Nice try. Use the Hint.",
    q5: "Audience poll: 100% say 'Be a baby.' You had one job."
  };

  // --- DOM ---
  const screens = {
    landing: document.getElementById('landing'),
    hook: document.getElementById('hook'),
    quiz: document.getElementById('quiz'),
    ask: document.getElementById('ask'),
    reveal: document.getElementById('reveal')
  };

  const startBtn = document.getElementById('start-btn');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const quizDoneBtn = document.getElementById('quiz-done-btn');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  const q1Block = document.getElementById('q1');
  const q2Block = document.getElementById('q2');
  const q3Block = document.getElementById('q3');
  const q4Block = document.getElementById('q4');
  const q5Block = document.getElementById('q5');
  const q1Feedback = document.getElementById('q1-feedback');
  const q1Lifelines = document.getElementById('q1-lifelines');
  const q2Answer = document.getElementById('q2-answer');
  const q2Submit = document.getElementById('q2-submit');
  const q2Feedback = document.getElementById('q2-feedback');
  const q2Lifelines = document.getElementById('q2-lifelines');
  const q2HintBox = document.getElementById('q2-hint');
  const q3Feedback = document.getElementById('q3-feedback');
  const q3Lifelines = document.getElementById('q3-lifelines');
  const q4Feedback = document.getElementById('q4-feedback');
  const q4Lifelines = document.getElementById('q4-lifelines');
  const q4HintBox = document.getElementById('q4-hint');
  const q5Feedback = document.getElementById('q5-feedback');
  const q5Lifelines = document.getElementById('q5-lifelines');
  const quizScoreEl = document.getElementById('quiz-score');

  // --- Helpers ---
  function updateScore() {
    state.score += 1;
    quizScoreEl.textContent = 'Score: ' + state.score + ' / 5';
  }

  var revealGifInterval = null;
  var REVEAL_GIFS = [
    'https://media.tenor.com/Jxbk24m0vV4AAAAM/vibe-rabbit.gif',   // Vibe rabbit dance (Tenor)
    'https://media.tenor.com/WDQr3UPxLOEAAAAi/bunny-twerk.gif',   // Bunny twerk (Tenor)
    'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif'      // Original Giphy
  ];

  function showScreen(id) {
    state.currentScreen = id;
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle('active', key === id);
    });
    if (id === 'reveal') {
      var idx = 0;
      var revealImg = document.getElementById('reveal-gif-rotate');
      if (revealImg && REVEAL_GIFS.length) {
        if (revealGifInterval) clearInterval(revealGifInterval);
        revealImg.src = REVEAL_GIFS[0];
        revealGifInterval = setInterval(function () {
          idx = (idx + 1) % REVEAL_GIFS.length;
          revealImg.src = REVEAL_GIFS[idx];
        }, 3500);
      }
    }
  }

  function normalizeAnswer(s) {
    return s.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function isQ2Correct(val) {
    const n = normalizeAnswer(val);
    return Q2_ACCEPTED.some(function (a) { return n === a || n.includes('tiamo'); });
  }

  function showFeedback(el, text, isCorrect) {
    el.textContent = text;
    el.className = 'feedback ' + (isCorrect ? 'correct' : 'wrong');
  }

  function useLifeline(name, questionId) {
    if (name === 'phone' && state.lifelinesUsed.phone) return;
    if (name === 'audience' && state.lifelinesUsed.audience) return;
    if (name === 'hint' && state.lifelinesUsed.hint) return;

    if (name === 'phone') {
      state.lifelinesUsed.phone = true;
      var msg = PHONE_FRIEND_MESSAGES[questionId];
      if (questionId === 'q1') {
        q1Feedback.textContent = msg;
        q1Feedback.className = 'feedback';
      } else if (questionId === 'q2') {
        q2Feedback.textContent = msg;
        q2Feedback.className = 'feedback';
      } else if (questionId === 'q3') {
        q3Feedback.textContent = msg;
        q3Feedback.className = 'feedback';
      } else if (questionId === 'q4') {
        q4Feedback.textContent = msg;
        q4Feedback.className = 'feedback';
        q4HintBox.classList.remove('hidden');
      } else if (questionId === 'q5') {
        q5Feedback.textContent = msg;
        q5Feedback.className = 'feedback';
      }
      disableLifelineButtons('phone');
    } else if (name === 'audience') {
      state.lifelinesUsed.audience = true;
      var msg = AUDIENCE_MESSAGES[questionId];
      if (questionId === 'q1') {
        q1Feedback.textContent = msg;
        q1Feedback.className = 'feedback';
      } else if (questionId === 'q2') {
        q2Feedback.textContent = msg;
        q2Feedback.className = 'feedback';
        q2HintBox.classList.remove('hidden');
      } else if (questionId === 'q3') {
        q3Feedback.textContent = msg;
        q3Feedback.className = 'feedback';
      } else if (questionId === 'q4') {
        q4Feedback.textContent = msg;
        q4Feedback.className = 'feedback';
        q4HintBox.classList.remove('hidden');
      } else if (questionId === 'q5') {
        q5Feedback.textContent = msg;
        q5Feedback.className = 'feedback';
      }
      disableLifelineButtons('audience');
    } else if (name === 'hint') {
      state.lifelinesUsed.hint = true;
      if (questionId === 'q2') {
        q2HintBox.classList.remove('hidden');
        q2HintBox.textContent = Q2_HINT;
        q2Feedback.textContent = 'Hint unlocked.';
      } else if (questionId === 'q4') {
        q4HintBox.classList.remove('hidden');
        q4Feedback.textContent = 'Hint unlocked.';
      }
      disableLifelineButtons('hint');
    }
  }

  function disableLifelineButtons(name) {
    var selector = '.lifeline[data-lifeline="' + name + '"]';
    document.querySelectorAll(selector).forEach(function (btn) {
      btn.disabled = true;
    });
  }

  // --- Q1 (colour) ---
  function setupQ1() {
    var options = q1Block.querySelectorAll('.option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.disabled) return;
        var correct = opt.dataset.correct === 'true';
        var wrongKey = opt.dataset.wrong || 'default';
        var wrongMsg = Q1_COLOUR_WRONG_MESSAGES[wrongKey] || Q1_COLOUR_WRONG_MESSAGES.default;

        if (correct) {
          updateScore();
          options.forEach(function (o) {
            o.disabled = true;
            if (o.dataset.correct === 'true') o.classList.add('correct');
          });
          showFeedback(q1Feedback, 'Sahi jawab!', true);
          setTimeout(function () {
            q1Block.classList.add('hidden');
            q2Block.classList.remove('hidden');
          }, 1200);
        } else {
          opt.disabled = true;
          opt.classList.add('wrong');
          showFeedback(q1Feedback, wrongMsg, false);
        }
      });
    });
    q1Lifelines.querySelectorAll('.lifeline').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        useLifeline(btn.dataset.lifeline, 'q1');
      });
    });
  }

  // --- Q2 (pasta) ---
  function handleQ2Submit() {
    var val = q2Answer.value;
    if (!val.trim()) {
      showFeedback(q2Feedback, 'Type something. Or use a lifeline.', false);
      return;
    }
    if (isQ2Correct(val)) {
      updateScore();
      showFeedback(q2Feedback, 'Sahi jawab!', true);
      q2Answer.disabled = true;
      q2Submit.disabled = true;
      q2Lifelines.querySelectorAll('.lifeline').forEach(function (b) { b.disabled = true; });
      setTimeout(function () {
        q2Block.classList.add('hidden');
        q3Block.classList.remove('hidden');
      }, 800);
    } else {
      showFeedback(q2Feedback, "Galat. Lifeline use karo ya phir soch ke likho.", false);
    }
  }

  const Q3_TAUNT_MESSAGE = "Tch, Tch. That's what you sent when I didn't check on you after your car acted up dropping me home. First meet. Sit with that.";
  const Q3_WRONG_MESSAGES = {
    chocolates: "Sweet thought—wrong order. That came later. Try again.",
    kiss: "Ruko zara, Sabar karo.",
    taunt: Q3_TAUNT_MESSAGE
  };

  // --- Q3 (first thing) ---
  function setupQ3() {
    var options = q3Block.querySelectorAll('.option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.disabled) return;
        var correct = opt.dataset.correct === 'true';
        var isTaunt = opt.dataset.taunt === 'true';
        var wrongKey = opt.dataset.wrong || (isTaunt ? 'taunt' : null);
        if (correct) {
          updateScore();
          options.forEach(function (o) {
            o.disabled = true;
            if (o === opt) o.classList.add('correct');
            else if (o.dataset.correct === 'true') o.classList.add('correct');
          });
          showFeedback(q3Feedback, 'Sahi jawab!', true);
          setTimeout(function () {
            q3Block.classList.add('hidden');
            q4Block.classList.remove('hidden');
          }, 1200);
        } else {
          opt.disabled = true;
          opt.classList.add('wrong');
          var feedbackMsg = wrongKey ? Q3_WRONG_MESSAGES[wrongKey] : "Nope. Try another.";
          var kissMemeWrap = document.getElementById('q3-kiss-meme-wrap');
          if (kissMemeWrap) {
            if (wrongKey === 'kiss') {
              kissMemeWrap.classList.remove('hidden');
              var kissVideo = document.getElementById('q3-kiss-meme-video');
              var kissImg = document.getElementById('q3-kiss-meme-img');
              if (kissVideo && kissImg) {
                var showGifFallback = function () {
                  kissVideo.classList.add('hidden');
                  kissImg.classList.remove('hidden');
                };
                kissVideo.onerror = showGifFallback;
                if (kissVideo.error) {
                  showGifFallback();
                } else {
                  kissVideo.classList.remove('hidden');
                  kissImg.classList.add('hidden');
                  kissVideo.muted = false;
                  kissVideo.play().catch(showGifFallback);
                  setTimeout(function () {
                    if (kissVideo.readyState < 2 && kissVideo.error) showGifFallback();
                  }, 500);
                }
              }
            } else {
              kissMemeWrap.classList.add('hidden');
              var v = document.getElementById('q3-kiss-meme-video');
              if (v) v.pause();
            }
          }
          showFeedback(q3Feedback, feedbackMsg, false);
        }
      });
    });
    q3Lifelines.querySelectorAll('.lifeline').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        useLifeline(btn.dataset.lifeline, 'q3');
      });
    });
  }

  // --- Q4 (sweet gesture) ---
  function setupQ4() {
    var options = q4Block.querySelectorAll('.option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.disabled) return;
        var correct = opt.dataset.correct === 'true';
        var wrongKey = opt.dataset.wrong || 'default';
        var wrongMsg = Q4_WRONG_MESSAGES[wrongKey] || Q4_WRONG_MESSAGES.default;

        if (correct) {
          updateScore();
          options.forEach(function (o) {
            o.disabled = true;
            if (o.dataset.correct === 'true') o.classList.add('correct');
          });
          showFeedback(q4Feedback, 'Sahi jawab!', true);
          setTimeout(function () {
            q4Block.classList.add('hidden');
            q5Block.classList.remove('hidden');
          }, 1200);
        } else {
          opt.disabled = true;
          opt.classList.add('wrong');
          showFeedback(q4Feedback, wrongMsg, false);
        }
      });
    });
    q4Lifelines.querySelectorAll('.lifeline').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        useLifeline(btn.dataset.lifeline, 'q4');
      });
    });
  }

  // --- Q5 (what I love to do with you) ---
  function setupQ5() {
    var options = q5Block.querySelectorAll('.option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.disabled) return;
        var correct = opt.dataset.correct === 'true';
        var wrongKey = opt.dataset.wrong || 'default';
        var wrongMsg = Q5_WRONG_MESSAGES[wrongKey] || Q5_WRONG_MESSAGES.default;

        if (correct) {
          updateScore();
          options.forEach(function (o) {
            o.disabled = true;
            if (o.dataset.correct === 'true') o.classList.add('correct');
          });
          showFeedback(q5Feedback, 'Sahi jawab!', true);
          setTimeout(function () {
            q5Block.classList.add('hidden');
            quizDoneBtn.classList.remove('hidden');
          }, 1200);
        } else {
          opt.disabled = true;
          opt.classList.add('wrong');
          showFeedback(q5Feedback, wrongMsg, false);
        }
      });
    });
    q5Lifelines.querySelectorAll('.lifeline').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        useLifeline(btn.dataset.lifeline, 'q5');
      });
    });
  }

  // --- No button ---
  function handleNoClick() {
    var msg = NO_MESSAGES[Math.min(state.noClickCount, NO_MESSAGES.length - 1)];
    state.noClickCount += 1;
    btnNo.textContent = msg;
    btnYes.style.transform = 'scale(' + (1 + state.noClickCount * 0.08) + ')';
    var x = (Math.random() - 0.5) * 40;
    var y = (Math.random() - 0.5) * 40;
    btnNo.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  }

  // --- Bind ---
  startBtn.addEventListener('click', function () {
    showScreen('hook');
  });

  startQuizBtn.addEventListener('click', function () {
    state.score = 0;
    quizScoreEl.textContent = 'Score: 0 / 5';
    showScreen('quiz');
  });

  quizDoneBtn.addEventListener('click', function () {
    showScreen('ask');
  });

  btnYes.addEventListener('click', function () {
    showScreen('reveal');
    var dooronAudio = document.getElementById('dooron-audio');
    if (dooronAudio) {
      dooronAudio.currentTime = 0;
      dooronAudio.play().catch(function () {});
    }
    if (typeof confetti === 'function') {
      var colors = ['#a63d2e', '#f5ebe0', '#c97b6b', '#2d1810'];
      var burst = function (delay, opt) {
        setTimeout(function () {
          confetti(opt || { particleCount: 100, spread: 90, origin: { y: 0.6 }, colors: colors });
        }, delay);
      };
      burst(0);
      burst(150);
      burst(300);
      burst(450);
      burst(600);
      burst(800);
      burst(1000);
      burst(1200, { particleCount: 80, spread: 70, origin: { x: 0.2, y: 0.7 } });
      burst(1400, { particleCount: 80, spread: 70, origin: { x: 0.8, y: 0.7 } });
    }
  });

  btnNo.addEventListener('click', handleNoClick);

  q2Submit.addEventListener('click', handleQ2Submit);
  q2Answer.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleQ2Submit();
  });

  q2Lifelines.querySelectorAll('.lifeline').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      if (btn.dataset.lifeline === 'hint') useLifeline('hint', 'q2');
      else useLifeline(btn.dataset.lifeline, 'q2');
    });
  });

  setupQ1();
  setupQ3();
  setupQ4();
  setupQ5();
})();
