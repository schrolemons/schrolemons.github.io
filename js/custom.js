if (document.querySelector('#bber-talk')) {
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        loop: true,
        autoplay: {
            delay: 3000,
            pauseOnMouseEnter: true
        },
    });
}


var percentFlag = false; // 节流阀
function essayScroll() {
    let a = document.documentElement.scrollTop || window.pageYOffset; // 卷去高度
    const waterfallResult = a % document.documentElement.clientHeight; // 卷去一个视口
    result <= 99 || (result = 99);

    if (
        !percentFlag &&
        waterfallResult + 100 >= document.documentElement.clientHeight &&
        document.querySelector("#waterfall")
    ) {
        // console.info(waterfallResult, document.documentElement.clientHeight);
        setTimeout(() => {
            waterfall("#waterfall");
        }, 500);
    } else {
        setTimeout(() => {
            document.querySelector("#waterfall") && waterfall("#waterfall");
        }, 500);
    }

    const r = window.scrollY + document.documentElement.clientHeight;

    let p = document.getElementById("post-comment") || document.getElementById("footer");

    (p.offsetTop + p.offsetHeight / 2 < r || 90 < result) && (percentFlag = true);
}
function replaceAll(e, n, t) {
    return e.split(n).join(t);
}
var anzhiyu = {
    diffDate: function (d, more = false) {
        const dateNow = new Date();
        const datePost = new Date(d);
        const dateDiff = dateNow.getTime() - datePost.getTime();
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;

        let result;
        if (more) {
            const monthCount = dateDiff / month;
            const dayCount = dateDiff / day;
            const hourCount = dateDiff / hour;
            const minuteCount = dateDiff / minute;

            if (monthCount >= 1) {
                result = datePost.toLocaleDateString().replace(/\//g, "-");
            } else if (dayCount >= 1) {
                result = parseInt(dayCount) + " " + GLOBAL_CONFIG.date_suffix.day;
            } else if (hourCount >= 1) {
                result = parseInt(hourCount) + " " + GLOBAL_CONFIG.date_suffix.hour;
            } else if (minuteCount >= 1) {
                result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.date_suffix.min;
            } else {
                result = GLOBAL_CONFIG.date_suffix.just;
            }
        } else {
            result = parseInt(dateDiff / day);
        }
        return result;
    },
    changeTimeInEssay: function () {
        document.querySelector("#bber") &&
        document.querySelectorAll("#bber time").forEach(function (e) {
            var t = e,
                datetime = t.getAttribute("datetime");
            (t.innerText = anzhiyu.diffDate(datetime, true)), (t.style.display = "inline");
        });
    },
    reflashEssayWaterFall: function () {
        document.querySelector("#waterfall") &&
        setTimeout(function () {
            waterfall("#waterfall");
            document.getElementById("waterfall").classList.add("show");
        }, 500);
    },
    commentText: function (txt) {
        const postCommentDom = document.querySelector("#post-comment");
        var domTop = postCommentDom.offsetTop;
        window.scrollTo(0, domTop - 80);
        if (txt == "undefined" || txt == "null") txt = "好棒！";
        function setText() {
            setTimeout(() => {
                var input = document.getElementsByClassName("el-textarea__inner")[0];
                if (!input) setText();
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("input", true, true);
                let inputValue = replaceAll(txt, "\n", "\n> ");
                input.value = "> " + inputValue + "\n\n";
                input.dispatchEvent(evt);
                input.focus();
                input.setSelectionRange(-1, -1);
                if (document.getElementById("comment-tips")) {
                    document.getElementById("comment-tips").classList.add("show");
                }
            }, 100);
        }
        setText();
    },
    initIndexEssay: function () {
        setTimeout(() => {
            let essay_bar_swiper = new Swiper(".essay_bar_swiper_container", {
                passiveListeners: true,
                direction: "vertical",
                loop: true,
                autoplay: {
                    disableOnInteraction: true,
                    delay: 3000,
                },
                mousewheel: true,
            });

            let essay_bar_comtainer = document.getElementById("bbtalk");
            if (essay_bar_comtainer !== null) {
                essay_bar_comtainer.onmouseenter = function () {
                    essay_bar_swiper.autoplay.stop();
                };
                essay_bar_comtainer.onmouseleave = function () {
                    essay_bar_swiper.autoplay.start();
                };
            }
        }, 100);
    },
};

anzhiyu.initIndexEssay();
anzhiyu.changeTimeInEssay();
anzhiyu.reflashEssayWaterFall();

function switchPostChart () {
    // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
        try {
            let postsOptionNew = postsOption
            postsOptionNew.title.textStyle.color = color
            postsOptionNew.xAxis.nameTextStyle.color = color
            postsOptionNew.yAxis.nameTextStyle.color = color
            postsOptionNew.xAxis.axisLabel.color = color
            postsOptionNew.yAxis.axisLabel.color = color
            postsOptionNew.xAxis.axisLine.lineStyle.color = color
            postsOptionNew.yAxis.axisLine.lineStyle.color = color
            postsOptionNew.series[0].markLine.data[0].label.color = color
            postsChart.setOption(postsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
        try {
            let tagsOptionNew = tagsOption
            tagsOptionNew.title.textStyle.color = color
            tagsOptionNew.xAxis.nameTextStyle.color = color
            tagsOptionNew.yAxis.nameTextStyle.color = color
            tagsOptionNew.xAxis.axisLabel.color = color
            tagsOptionNew.yAxis.axisLabel.color = color
            tagsOptionNew.xAxis.axisLine.lineStyle.color = color
            tagsOptionNew.yAxis.axisLine.lineStyle.color = color
            tagsOptionNew.series[0].markLine.data[0].label.color = color
            tagsChart.setOption(tagsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
        try {
            let categoriesOptionNew = categoriesOption
            categoriesOptionNew.title.textStyle.color = color
            categoriesOptionNew.legend.textStyle.color = color
            if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
            categoriesChart.setOption(categoriesOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
}

$(document).ready(function () {
    document.getElementById("mode-button").addEventListener("click", function () { setTimeout(switchPostChart, 100) })
});

// 发现有时会和当前页面重复，加一个判断
function randomPost() {
    fetch('/baidusitemap.xml').then(res => res.text()).then(str => (new window.DOMParser()).parseFromString(str, "text/xml")).then(data => {
        let ls = data.querySelectorAll('url loc');
        while (true) {
            let url = ls[Math.floor(Math.random() * ls.length)].innerHTML;
            if (location.href == url) continue;
            location.href = url;
            return;
        }
    })
}



