
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
    }
    
}

var $containerLoading = $('.container--loading');
var $containerCountdown = $('.container--countdown');

var mainModule=(($)=> {
    var _introMessage = "Hello {player}!";    
    var $progressbar = $('#progress progress');

    function _init() {
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
                    // $loadingcontainer.hide();
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
     * @param {*} target - the bubble text element (e.g. #bubble-cd)
     * @param {*} charId - the character id to fetch a quote from quotes object
     */
    function _generateQuote(target, charId) {
        if(target && charId) {
            var availableQuotes = quotes.cd[charId];
            var newQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
            $(target).text(newQuote);
        }
    }

    return {
        init: ()=>{
            _init();
        },
        doIntro: ()=>{
            _doIntro();
        },
        generateQuote: (target,charId)=>{
            _generateQuote(target,charId);
        },
        doLoading:(load)=>{
            _doLoading(load);
            $('.nes-btn.btn--load').on('click', ()=> {
                $containerLoading.hide();
                $containerCountdown.show();
            });
        }
    }
})($);

var cdModule=(($)=> {
    function _countdown() {
        var countDownDate = new Date("July 29, 2020 00:00:00").getTime();

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
            $('#cdtimer').text(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ");
            
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                $('#cdtimer').text("TIME UP");
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
                mainModule.generateQuote('#bubble__text--cd',charId);

            });
        });
        
    }

    return {
        init: ()=>{
            _countdown();
            _initBubbles();
        }
    }
})($);

mainModule.doLoading(true);
cdModule.init();
mainModule.init();
