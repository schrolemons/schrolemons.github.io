var selectTextNow = "";
let rmWidth = $("#rightMenu").width(),
    rmHeight = $("#rightMenu").height(),
    domhref = "",
    domImgSrc = "",
    globalEvent = null,
    rm = {};

function imageToBlob(e) {
    const n = new Image,
        t = document.createElement("canvas"),
        o = t.getContext("2d");
    return n.crossOrigin = "", n.src = e, new Promise((e => {
        n.onload = function() {
            t.width = this.naturalWidth, t.height = this.naturalHeight, o.drawImage(this, 0, 0), t.toBlob((n => {
                e(n)
            }), "image/png", .75)
        }
    }))
}
async function copyImage(e) {
    const n = await imageToBlob(e),
        t = new ClipboardItem({
            "image/png": n
        });
    navigator.clipboard.write([t])
}

function stopMaskScroll() {
    if (document.getElementById("rightMenu-mask")) {
        document.getElementById("rightMenu-mask").addEventListener("mousewheel", (function(e) {
            rm.hideRightMenu()
        }), !1)
    }
    if (document.getElementById("rightMenu")) {
        document.getElementById("rightMenu").addEventListener("mousewheel", (function(e) {
            rm.hideRightMenu()
        }), !1)
    }
}

function addRightMenuClickEvent() {
    $("#rightMenu-mask").on("click", rm.hideRightMenu),
        $("#rightMenu-mask").contextmenu((function() {
            return rm.hideRightMenu(), !1
        })),
        $("#menu-backward").on("click", (function() {
            window.history.back(),
                rm.hideRightMenu()
        })),
        $("#menu-forward").on("click", (function() {
            window.history.forward(),
                rm.hideRightMenu()
        })),
        $("#menu-refresh").on("click", (function() {
            rm.hideRightMenu(),
                window.location.reload()
        })),
        $("#menu-darkmode").on("click", rm.switchDarkMode),
        $("#menu-reading").on("click", rm.switchReadMode),
        $("#menu-commentBarrage").on("click", (function() {
            rm.hideRightMenu(),
                rm.switchCommentBarrage()
        })),
        $("#menu-postlink").on("click", rm.copyPostUrl),
        $("#menu-copytext").on("click", (function() {
            rm.rightmenuCopyText(selectTextNow),
                btf.snackbarShow("复制成功，复制和转载请标注本文地址")
        })),
        $("#menu-pastetext").on("click", rm.pasteText),
        $("#menu-commenttext").on("click", (function() {
            rm.commentText(selectTextNow),
                rm.hideRightMenu()
        })),
        $("#menu-searchBaidu").on("click", rm.searchBaidu),
        $("#menu-newwindow").on("click", (function() {
            window.open(domhref),
                rm.hideRightMenu()
        })),
        $("#menu-copylink").on("click", rm.copyLink),
        $("#menu-copyimg").on("click", (function() {
            rm.writeClipImg(domImgSrc)
        })),
        $("#menu-downloadimg").on("click", (function() {
            rm.downloadImage(domImgSrc, "MeuiCat")
        })),
        $("#menu-copylinkimg").on("click", (function() {
            rm.CopyLinkImg(domImgSrc)
        })),
        $("#menu-randomPost").on("click", (function() {
            rm.hideRightMenu(),
                toRandomPost()
        })),
        $("#menu-translate").on("click", rm.translate),
        $("#menu-asidehide").on("click", rm.hideAsideBtn)
}

function selceText() {
    var e;
    e = document.selection ? document.selection.createRange()
        .text : window.getSelection() + "", selectTextNow = e || ""
}

window.oncontextmenu = function(e) {
    if (document.body.clientWidth > 768) {
        let n = e.clientX + 10,
            t = e.clientY,
            p = $(".rightMenuPost"),
            o = $(".rightMenuOther"),
            i = $(".rightMenuPlugin"),
            g = $("#menu-commentBarrage"),
            c = $("#menu-copytext"),
            r = $("#menu-pastetext"),
            m = $("#menu-commenttext"),
            d = $("#menu-search"),
            s = $("#menu-searchBaidu"),
            a = $("#menu-newwindow"),
            u = $("#menu-copylink"),
            l = $("#menu-copyimg"),
            h = $("#menu-downloadimg"),
            w = $("#menu-copylinkimg"),
            y = e.target.href,
            M = e.target.currentSrc,
            b = !1;
        return o.show(),
            globalEvent = e,
            selectTextNow && window.getSelection() ? (b = !0, c.show(), $("#post-comment").length ? m.show() : m.hide(), d.show(), s.show(), p.hide()) : (c.hide(), m.hide(), d.hide(), s.hide()),
            y ? (b = !0, a.show(), u.show(), domhref = y, p.hide()) : (a.hide(), u.hide()),
            M ? (b = !0, l.show(), h.show(), w.show(), domImgSrc = M, p.hide()) : (l.hide(), h.hide(), w.hide()),
            "input" === e.target.tagName.toLowerCase() || "textarea" === e.target.tagName.toLowerCase() ? (b = !0, r.show(), p.hide()) : r.hide(),
            b ? (o.hide(), i.show()) : (i.hide(), $("#body-wrap.post").length ? p.show() : p.hide()),
            $(".read-mode").length ? g.hide() : g.show(),
            rm.reloadrmSize(),
        n + rmWidth > window.innerWidth && (n -= rmWidth + 10),
        t + rmHeight > window.innerHeight && (t -= t + rmHeight - window.innerHeight),
            rm.showRightMenu(!0, t, n),
            $("#rightMenu-mask").attr("style", "display: flex"),
            !1;
    }
}
document.onmouseup = document.ondbclick = selceText

rm.showRightMenu = function(e, n = 0, t = 0) {
    let o = $("#rightMenu");
    o.css("top", n + "px").css("left", t + "px"),
        e ? (o.show(), stopMaskScroll()) : o.hide()
},
    rm.hideRightMenu = function() {
        rm.showRightMenu(!1),
            $("#rightMenu-mask").attr("style", "display: none")
    },
    rm.reloadrmSize = function() {
        rmWidth = $("#rightMenu").width(),
            rmHeight = $("#rightMenu").height()
    },
    rm.switchDarkMode = function() {
        const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        if (nowMode === 'light') {
            activateDarkMode()
            saveToLocal.set('theme', 'dark', 2)
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
        } else {
            activateLightMode()
            saveToLocal.set('theme', 'light', 2)
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
        }
        typeof utterancesTheme === 'function' && utterancesTheme()
        typeof FB === 'object' && window.loadFBComment()
        window.DISQUS && document.getElementById('disqus_thread')
            .children.length && setTimeout(() => window.disqusReset(), 200)
        rm.hideRightMenu()
    },
    rm.switchReadMode = function() {
        const $body = document.body;
        if ($(".read-mode").length === 0) {
            $body.classList.add('read-mode');
            const newEle = document.createElement('button');
            newEle.type = 'button';
            newEle.className = 'iconfont icat-exit-mode exit-readmode';
            $body.appendChild(newEle);

            const clickFn = () => {
                $body.classList.remove('read-mode');
                newEle.remove();
                newEle.removeEventListener('click', clickFn);
            };

            newEle.addEventListener('click', clickFn);
            $("#menu-reading span").text("退出阅读模式");
        } else {
            $body.classList.remove('read-mode');
            $(".exit-readmode").remove();
            $("#menu-reading span").text("阅读模式");
        }
        rm.hideRightMenu();
    },
    rm.switchCommentBarrage = function() {
        document.querySelector(".comment-barrage") && ($(".comment-barrage").is(":visible") ? ($(".comment-barrage").hide(),
            $("#menu-commentBarrage span").text("显示热评"),
            document.querySelector("#consoleCommentBarrage").classList.remove("on"),
            localStorage.setItem("commentBarrageSwitch", "false")) : $(".comment-barrage").is(":hidden") && ($(".comment-barrage").show(),
            $("#menu-commentBarrage span").text("关闭热评"),
            document.querySelector("#consoleCommentBarrage").classList.add("on"),
            localStorage.removeItem("commentBarrageSwitch"))),
            rm.hideRightMenu()
    },
    rm.copyUrl = function(e) {
        $("body")
            .after("<input id='copyVal'></input>");
        var n = e,
            t = document.getElementById("copyVal");
        t.value = n, t.select(), t.setSelectionRange(0, t.value.length), document.execCommand("copy"), $("#copyVal")
            .remove()
    },
    rm.copyPostUrl = function() {
        var e = window.location.href;
        rm.copyUrl(e),
            btf.snackbarShow("复制本页链接地址成功", !1, 2000),
            rm.hideRightMenu()
    },
    rm.rightmenuCopyText = function(e) {
        navigator.clipboard && navigator.clipboard.writeText(e),
            rm.hideRightMenu()
    },
    rm.readClipboard = function() {
        navigator.clipboard && navigator.clipboard.readText()
            .then((e => rm.insertAtCaret(globalEvent.target, e)))
    },
    rm.insertAtCaret = function(e, n) {
        const t = e.selectionStart,
            o = e.selectionEnd;
        if (document.selection) e.focus(), document.selection.createRange()
            .text = n, e.focus();
        else if (t || "0" == t) {
            var i = e.scrollTop;
            e.value = e.value.substring(0, t) + n + e.value.substring(o, e.value.length), e.focus(), e.selectionStart = t + n.length, e.selectionEnd = t + n.length, e.scrollTop = i
        } else e.value += n, e.focus()
    },
    rm.pasteText = function() {
        rm.readClipboard(),
            rm.hideRightMenu()
    },
    rm.commentText = function (txt) {
        const inputs = ["#wl-edit", ".el-textarea__inner"];
        for (let i = 0; i < inputs.length; i++) {
            let el = document.querySelector(inputs[i]);
            if (el != null) {
                el.dispatchEvent(new Event('input', { bubble: true, cancelable: true }));
                el.value = '> ' + txt.replace(/\n/g, '\n> ') + '\n\n';
                el.focus();
                el.setSelectionRange(-1, -1);
            }
        }
    },
    rm.searchBaidu = function() {
        btf.snackbarShow("即将跳转到百度搜索", !1, 2000), setTimeout((function() {
            window.open("https://www.baidu.com/s?wd=" + selectTextNow)
        }), "2000"),
            rm.hideRightMenu()
    },
    rm.rightmenuCopyText = function(e) {
        navigator.clipboard && navigator.clipboard.writeText(e),
            rm.hideRightMenu()
    },
    rm.copyLink = function() {
        rm.rightmenuCopyText(domhref),
            btf.snackbarShow("已复制链接地址")
    },
    rm.downloadimging = !1,
    rm.writeClipImg = function(e) {
        const t = "2000";
        const n = "localhost" === window.location.hostname || "127.0.0.1" === window.location.hostname ? 0 : 10000;
        console.log("按下复制"),
            rm.hideRightMenu(),
            btf.snackbarShow("正在下载中，请稍后", !1, n),
        0 == rm.downloadimging && (rm.downloadimging = !0,
            setTimeout((function() {
                copyImage(e), btf.snackbarShow("复制成功！图片已添加盲水印，请遵守版权协议"), rm.downloadimging = !1
            }), t))
    },
    rm.downloadImage = function(e, t) {
        rm.hideRightMenu(),
            0 == rm.downloadimging ? (rm.downloadimging = !0, btf.snackbarShow("正在下载中，请稍后", !1, 10000), setTimeout((function() {
                let o = new Image;
                o.setAttribute("crossOrigin", "anonymous"), o.onload = function() {
                    let e = document.createElement("canvas");
                    e.width = o.width, e.height = o.height, e.getContext("2d")
                        .drawImage(o, 0, 0, o.width, o.height);
                    let n = e.toDataURL("image/png"),
                        a = document.createElement("a"),
                        l = new MouseEvent("click");
                    a.download = t || "photo", a.href = n, a.dispatchEvent(l)
                }, o.src = e, btf.snackbarShow("图片已添加盲水印，请遵守版权协议"), rm.downloadimging = !1
            }), "10000")) : btf.snackbarShow("有正在进行中的下载，请稍后再试")
    },
    rm.CopyLinkImg = function(e) {
        rm.rightmenuCopyText(e),
            btf.snackbarShow("已复制图片链接")
    },
    rm.translate = function() {
        rm.hideRightMenu(),
            document.getElementById("translateLink").click();
    },
    rm.hideAsideBtn = function() {
        const $htmlDom = document.documentElement.classList
        const saveStatus = $htmlDom.contains('hide-aside') ? 'show' : 'hide'
        saveToLocal.set('aside-status', saveStatus, 2)
        $htmlDom.toggle('hide-aside')
        rm.hideRightMenu()
    };

// 右键菜单


