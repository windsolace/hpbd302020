
import './css/nes.min.css';
import './css/normalize.css';
import './css/main.less'; //this is loaded by webpack
import './css/NuKinakoMochi-Reg.otf';
import './index.html';
import './js/vendor/modernizr-3.8.0.min.js';
import './js/vendor/plugins.js';


//load all images
function importAll(r) {
    return r.keys().map(r);
}
const images = importAll(require.context('./img', true, /\.(png|jpe?g|svg|gif)$/));

//name=?&puzzle=
var player = {
    "name":"Adventurer"
};

var quotes = {
    "cd":{
        "main":[". . ."],
        "you":[
            "ちょっとまっててね！",
            "おはようそろ！！"
        ]
    },
    "p1":{
        "kasumi":[
            "カスカス"
        ],
        "shizuku":[
            "何に先輩 ?"
        ],
        "ruby":[
            "ピギー !",
            "ピギャー !"
        ]
    },
    "p1c":{
        "ruby":[
            "セクシーホームチューチャ来たよ",
            "えへーえへー "
        ],
        "eli":[
            "fripsideのこと、知ってるの？",
            "私のニックネームはなんでしょか"
        ],
        "hanamaru":[
            "フンフン",
            "ノッポパン食べたいな"
        ]
    },
    "p3":{
        "ruby":[
            "このパズル私たちいっしょうに～"
        ],
        "kasumi":[
            "みんなのプリンセスかすみんだよ！",
            "カスカスじゃなくてカスミンです！"
        ],
        "shizuku":[
            "人生下り坂上り坂。でもやっぱり～",
            "演劇もスクールアイドルも頑張ります！"
        ]
    }
    
}

var $containerLoading = $('.container--loading');
var containerCountdownClass = ".container--countdown";
var $containerIntro = $('.container--intro');

var mainModule=(($)=> {
    var _introMessage = "Hello {player}!";    
    var $progressbar = $('#progress progress');

    function _init() {
        //disable right click
        $(document).bind("contextmenu", (e)=>{
            return false;
        });
        var queryString = window.location.search;
        //get name from url parameter
        const urlParams = new URLSearchParams(queryString);
        var playerName = urlParams.get('name');
        if(playerName) player.name=playerName;
        _introMessage = _introMessage.replace("{player}", player.name);
        _doIntro();
    }

    function _increaseLoadingBar(amount) {
        var currentLoadingPercentage = parseInt($progressbar.attr("value"));
        if(currentLoadingPercentage < 100) {
            $progressbar.attr("value", currentLoadingPercentage+amount);
        }
    }

    /**
     * Start/stop the loading bar. 
     * @param load - indicate whether to show or hide loader
     * @param reset - indicate whether to reset the loadingbar
     */
    function _doLoading(load, reset) {
        // _initSpriteJump();

        var $loadingcontainer = $containerLoading;
        if(load) {
            $loadingcontainer.show();
            if(reset) $progressbar.attr("value", 0); //reset to 0
            var currentLoadingPercentage = parseInt($progressbar.attr("value"));
            window.setTimeout(() => {
                _increaseLoadingBar(10);
                if(currentLoadingPercentage < 100){
                    _doLoading(true, false);
                } else {
                    console.log("loading complete");
                    $('.nes-btn.btn--load').removeClass('is-disabled');
                }
            }, 100);
        } else {
            $loadingcontainer.hide();
        }
    }

    function _doIntro() {
        $('#player-intro').text(_introMessage);
        console.log(_introMessage);
    }

    /**
     * Fetches a quote for a character and insert into target bubble
     * @param {*} target - the bubble text element id (e.g. #bubble-cd)
     * @param {*} section - quotetype
     * @param {*} charId - the character id to fetch a quote from quotes object
     */
    function _generateQuote(target, section,charId) {
        if(target && charId) {
            var availableQuotes = quotes[section][charId];
            var newQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
            $(target).text(newQuote);
        }
    }

    return {
        init: ()=>{
            _init();
            puzzleModule.init();
        },
        doIntro: ()=>{
            _doIntro();
        },
        generateQuote: (target,section,charId)=>{
            _generateQuote(target,section,charId);
        },
        doLoading:(load)=>{
            _doLoading(load);
            $('.nes-btn.btn--load').on('click', (e)=> {
                var target = e.target;
                if(!$(target).hasClass('is-disabled')) {
                    $containerLoading.hide();
                    $(containerCountdownClass+"-1").show();
                }
            });
        }
    }
})($);

var puzzleModule=(($)=> {

    var puzzleJson = {
        "1a":{
            "answer":"esplanade",
            "clue":"1.290647,103.8539352",
            "next":"1b"
        },
        "1b":{
            "answer":"national museum",
            "clue":"1.2954308,103.8496061",
            "next":"1c"
        },
        "1c":{
            "answer":"funan",
            "clue":"1.2927612,103.8503824",
            "next":"1d"
        },
        "1d":{
            "answer":"chijmes",
            "clue":"1.2942412,103.851834",
            "next":"1e"
        },
        "1e":{
            "answer":"capitol kempinski",
            "clue":"",
            "next":"2"
        },
        "2":{
            "answer":"rengaya",
            "clue":"",
            "next":"2a"
        },
        "2a":{
            "answer":"countdown",
            "clue":"",
            "next":"3"
        },
        "3":{
            "answer":"present",
            "clue":"",
            "next":"4"
        },
        "4":{
            "answer":"antidote",
            "clue":"",
            "next":"winner-1"
        },
        "winner-1":{
            "answer":"",
            "clue":"",
            "next":"bonus1"
        },
        "bonus1":{
            "answer":"sushiro",
            "clue":"",
            "next":"bonus2"
        },
        "bonus2":{
            "answer":"empress",
            "clue":"",
            "next":"bonus3"
        },
        "bonus3":{
            "answer":"kranji",
            "clue":"",
            "next":"winner-2"
        },
        "winner-2":{
            "answer":"",
            "clue":"",
            "next":""
        }
    };

    const btnGuessClass= ".btn-guess";
    const btnNextQClass= ".btn-nextq";

    function _init() {
        //attach onclick to guess buttons
        $(btnGuessClass).on('click', (e) => {
            e.preventDefault();
            var $currentTarget = $(e.currentTarget); //the guess btn that was clicked
            var $input = $currentTarget.prev();
            var value = $input.val();
            var puzzleId = getPuzzleIdFromInput($currentTarget);
            console.log("Checking " + puzzleId + " : " + $input.val());
            var result = _checkAnswer(puzzleId, value);

            if(result) {
                document.getElementById('dialog-winner').showModal();
                //show clue if any
                var clue = puzzleJson[puzzleId]["clue"];
                if(clue) $(".clue").text("You found a clue! " + clue);
                //hide guess btn
                $currentTarget.hide();
                //enable next button
                var $next = $currentTarget.next();
                $next.show();
                $next.removeClass('is-disabled');
                $next.attr('disabled',false);
            } else {
                document.getElementById('dialog-loser').showModal();
            }
        });

        //attach onclick to next btn
        $(btnNextQClass).on('click', (e) => {
            e.preventDefault();
            //remove clue text
            $('.clue').text();
            var $currentTarget = $(e.currentTarget);
            var puzzleId = getPuzzleIdFromInput($currentTarget);
            var nextPuzzleId = puzzleJson[puzzleId]["next"];
            console.log("Next puzzle is " + nextPuzzleId);

            //hide current puzzle, show the next puzzle
            _loadNextPuzzle(puzzleId, nextPuzzleId);
        });
    }

    /**
     * Hide the current puzzle by id and load the next puzzle by id
     * @param {*} currentId 
     * @param {*} nextId 
     */
    function _loadNextPuzzle(currentId, nextId) {
        if(currentId) $('.container.puzzle[data-puzzleid="'+currentId+'"]').hide();
        $('.container.puzzle[data-puzzleid="'+nextId+'"]').show();
    }

    /**
     * Determine the current puzzle id based on clicked button
     * @param target - the current clicked button
     * @return puzzleId
     */
    function getPuzzleIdFromInput(target) {
        var $puzzleContainer = target.parents('.container.puzzle');
        return $puzzleContainer.data('puzzleid');
    }

    /**
     * Checks answer against puzzleJson 
     * @param puzzleId - e.g. 1a
     * @param val - the input from player
     * @return result - true or false
     */
    function _checkAnswer(puzzleId, val) {
        var answer = puzzleJson[puzzleId]["answer"];
        var result = val.toLowerCase() == answer;
        // console.log("answer is " + answer + ". Result = " + result);
        return result;
    }

    return {
        init: ()=>{
            _init();
        },
        loadNextPuzzle: (current, next)=>{
            _loadNextPuzzle(current, next);
        }
    }
})($);

var cdModule=(($)=> {
    function _countdown(date, timerId, startMsg, endMsg) {
        var countDownDate = new Date(date).getTime();
        var $currentCountdownContainer = $('#'+timerId).parents('.container--countdown');
        $currentCountdownContainer.find(".countdown__msg").text(startMsg);
        // $(".countdown__msg").text(startMsg);

        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get today's date and time
            var now = new Date().getTime();
            
            // Find the distance between now and the count down date
            var distance = countDownDate - now;
            
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result in the element with id="demo"
            $('#' + timerId).text(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ");
            
            // If the count down is finished, write some text
            if (distance < 0) {
            // if(true) {
                clearInterval(x);
                $('#' + timerId).text(endMsg);
                $('#sprite-bday').show();
                var $yaybtn = $currentCountdownContainer.find('.btn-yay');
                $yaybtn.removeClass('is-disabled').attr("disabled", false).show();
            }
        }, 1000);
    }

    function _initBubbles() {
        $('.sprite--chibi').each((index, item)=> {
           $(item).on('click', (el)=>{

                //change bubble tip
                var isLeft = $(el.target).hasClass('left');
                var $balloon = $(item).parent().siblings('.nes-balloon');
                if(isLeft){
                    $balloon.removeClass('from-right');
                    $balloon.addClass('from-left');
                } else {
                    $balloon.removeClass('from-left');
                    $balloon.addClass('from-right');
                }

                //get a random quote for character
                var charId = $(item).data('quoteid');
                var quoteType = $(item).data('quotetype');
                mainModule.generateQuote('#bubble__text--'+quoteType,quoteType,charId);

            });
        });
        
    }

    return {
        init: ()=>{
            _countdown("July 29, 2020 00:00:00", "cdtimer","Something is happening!", "HAPPY BIRTHDAY!!");
            _countdown("July 29, 2020 20:00:00", "cdtimer2","Next Puzzle in...", "LET'S GO!!");
            _initBubbles();
        },
        startCountdown:(date, countdownId, startMsg, endMsg)=>{
            _countdown(date, countdownId, startMsg, endMsg);
        }
    }
})($);

mainModule.doLoading(true);
cdModule.init();
mainModule.init();

//btn events
$(".container--countdown-1 .btn-yay").click(()=>{
    //show the intro
    $(containerCountdownClass+"-1").hide();
    $containerIntro.show();
});
$(".btn-start").click(()=>{
    //start with q1a
    $containerIntro.hide();
    puzzleModule.loadNextPuzzle(null,"1a");
});
$(".container--countdown-2 .btn-yay").click(()=>{
    //continue with next question
    $(containerCountdownClass+"-2").hide();
    puzzleModule.loadNextPuzzle(null,"3");
});
