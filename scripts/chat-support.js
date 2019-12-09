import keys from '../config/keys'

function setupHelpscout() {
    !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){})
    window.Beacon('init', 'a5b45ca4-af09-460f-9575-4c0a7cfb34c5')
}

// If using a free chatapp called chatra
function setupChatra(window, document) {
    let chatScript = (function(d, w, c) {
        w.ChatraID = 'Fcy6YwtRWuZxPoMLB';
        var s = d.createElement('script');
        w[c] = w[c] || function() {
            (w[c].q = w[c].q || []).push(arguments);
        };
        s.async = true;
        s.src = 'https://call.chatra.io/chatra.js';
        if (d.head) d.head.appendChild(s);
    });
    
    chatScript(document, window, 'Chatra')
    
    window.ChatraSetup = {
        colors: {
            buttonText: keys.APP_WHITE, /* chat button text color */
            buttonBg: keys.APP_COLOR    /* chat button background color */
        }
    };
}

module.exports = {setupHelpscout, setupChatra}
