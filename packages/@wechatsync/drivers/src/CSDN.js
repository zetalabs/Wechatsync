

// const TurndownService = turndown

function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

function signCSDN(apiPath, contentType = 'application/json') {
	var once = createUuid()
  var signStr = `POST
*/*

application/json

x-ca-key:203803574
x-ca-nonce:${once}
${apiPath}`
	var hash = CryptoJS.HmacSHA256(signStr, "9znpamsyl2c7cdrr9sas0le9vbc3r6ba");
	var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return {
    accept: '*/*',
    'content-type': contentType,
    'x-ca-key': 203803574,
    'x-ca-nonce': once,
    'x-ca-signature': hashInBase64,
    'x-ca-signature-headers':'x-ca-key,x-ca-nonce'
  }
}

/**************************************
 * signCSDN0() reference function
 *
 *             t.headers["X-Ca-Signature"] = A({
                method: o,
                url: i,
                accept: e,
                params: c,
                date: n,
                contentType: a,
                headers: t.headers,
                appSecret: "i5rbx2z2ivnxzidzpfc0z021imsp2nec"
            }),
  **************************************
A = function(t) {
  var e = t.method
    , n = t.url
    , r = t.appSecret
    , a = t.accept
    , o = t.date
    , i = t.contentType
    , c = t.params
    , u = t.headers
    , l = "";
  c || -1 === n.indexOf("?") ? c || (c = {}) : (c = function(t) {
      var e = {}
        , n = t.match(/[?&]([^=&#]+)=([^&#]*)/g);
      if (n)
          for (var r in n) {
              var a = n[r].split("=")
                , o = a[0].substr(1)
                , i = a[1];
              e[o] ? e[o] = [].concat(e[o], i) : e[o] = i
          }
      return e
  }(n),
  n = n.split("?")[0]);
  l += e + "\n",
  l += a + "\n",
  l += "\n",
  l += i + "\n",
  l += o + "\n";
  var s = v(u)
    , p = f()(h()(s)).sort()
    , m = !0
    , g = !1
    , R = void 0;
  try {
      for (var A, P = d()(p); !(m = (A = P.next()).done); m = !0) {
          var L = A.value;
          l += L + ":" + s[L] + "\n"
      }
  } catch (t) {
      g = !0,
      R = t
  } finally {
      try {
          !m && P.return && P.return()
      } finally {
          if (g)
              throw R
      }
  }
  return l += function(t, e) {
      var n = f()(h()(e)).sort()
        , r = null
        , a = !0
        , o = !1
        , i = void 0;
      try {
          for (var c, u = d()(n); !(a = (c = u.next()).done); a = !0) {
              var l = c.value
                , s = void 0;
              s = void 0 !== e[l] && "" !== e[l] ? l + "=" + e[l] : l + e[l],
              r = r ? r + "&" + s : s
          }
      } catch (t) {
          o = !0,
          i = t
      } finally {
          try {
              !a && u.return && u.return()
          } finally {
              if (o)
                  throw i
          }
      }
      return r ? t + "?" + r : t
  }(n.replace(/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.csdn\.net)/, ""), c),
  _.a.HmacSHA256(l, r).toString(_.a.enc.Base64)
}
*/

function signCSDN0(apiPath, cookies = 'UserName=dvd37784302; UserToken=09fe1ed5d2e443cba7aaebd8513a5529') {
	var once = createUuid()
  var signStr = `GET
application/json, text/plain, */*



x-ca-key:203796071
x-ca-nonce:${once}
${apiPath}`
	var hash = CryptoJS.HmacSHA256(signStr, "i5rbx2z2ivnxzidzpfc0z021imsp2nec");
	var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return {
    accept: 'application/json, text/plain, */*',
    'x-ca-key': 203796071,
    'x-ca-nonce': once,
    'x-ca-signature': hashInBase64,
    'x-ca-signature-headers':'x-ca-key,x-ca-nonce'
  }
}

function validateFileExt(ext) {
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'gif':
      return true
    default:
      return false
  }
}

export default class CSDNAdapter {
  constructor() {
    this.version = '0.0.1'
    this.name = 'csdn'
/*
    modifyRequestHeaders('bizapi.csdn.net/', {
    	Origin: 'https://editor.csdn.net',
      Referer: 'https://editor.csdn.net/'
    }, [
    	'*://bizapi.csdn.net/*',
    ])
*/
  }

  async getMetaData() {
/*
    var res = await $.get('https://me.csdn.net/api/user/show')
*/
    var headers = signCSDN0('/community-personal/v1/get-personal-info')
    var res = await axios.get(
      'https://bizapi.csdn.net/community-personal/v1/get-personal-info',
      {
        headers: headers,
        withCredentials: true
      }
    )
    return {
      uid: res.data.data.basic.id,
      title: res.data.data.basic.nickname,
      avatar: res.data.data.general.avatar,
      type: 'csdn',
      displayName: 'CSDN',
      supportTypes: ['markdown', 'html'],
      home: 'https://mp.csdn.net/',
      icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
    }
  }

  async requestUpload(filename) {
    const api = 'https://imgservice.csdn.net/direct/v1.0/image/upload?watermark=&type=blog&rtype=markdown'
    const fileExt = file.name.split('.').pop()
    if (!validateFileExt(fileExt)) {
      return null
    }

    var res = await axios({
      url: api,
      method: 'get',
      headers: {
        'x-image-app': 'direct_blog',
        'x-image-suffix': fileExt,
        'x-image-dir': 'direct'
      },
    })
    if (res.status !== 200 || res.data.code !== 200) {
      console.log(res)
      return null
    }
    return res.data.data
  }

  async uploadFile(file) {
    const uploadData = await requestUpload(file.name)
    if (!uploadData) {
      return [{url: file.src}]
    }

    const uploadUrl = uploadData.host
    const form = new FormData()
    form.append('key', uploadData.filePath)
    form.append('policy', uploadData.policy)
    form.append('OSSAccessKeyId', uploadData.accessId)
    form.append('success_action_status', '200')
    form.append('signature', uploadData.signature)
    form.append('callback', uploadData.callbackUrl)

    const f = new File([file.bits], 'temp', {
      type: file.type
    });
    form.append('file', f)

    var res = await axios({
      url: uploadUrl,
      method: 'post',
      data: form
    })
    if (res.status !== 200 || res.data.code !== 200) {
      console.log(res)
      return [{url: file.src}]
    }
    return [{url: res.data.data.imageUrl}]
  }

  async addPost(post) {
    return {
      status: 'success',
      post_id: 0,
    }
  }
  async editPost(post_id, post) {
		// 支持HTML
    if(!post.markdown) {
      var turndownService = new turndown()
    	turndownService.use(tools.turndownExt)
    	var markdown = turndownService.turndown(post.post_content)
    	console.log(markdown);
    	post.markdown = markdown
    }

		var postStruct = {
    	    content: post.post_content,
          markdowncontent: post.markdown,
          not_auto_saved: "1",
          readType: "public",
          source: "pc_mdeditor",
          status: 2,
          title: post.post_title,
    }
		var headers = signCSDN('/blog-console-api/v3/mdeditor/saveArticle')
    var res = await axios.post(
      'https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle',
      postStruct,
      {
        headers: headers
    })
  	post_id = res.data.data.id
    console.log(res)
    return {
      status: 'success',
      post_id: post_id,
      draftLink: 'https://editor.csdn.net/md?articleId=' + post_id,
    }
  }

  async preEditPost(post) {
    var div = $('<div>')
    $('body').append(div)
    try {
      div.html(post.content)
      var doc = div
      tools.processDocCode(div)
      tools.makeImgVisible(div)
      var tempDoc = $('<div>').append(doc.clone())
      post.content =
        tempDoc.children('div').length == 1
          ? tempDoc.children('div').html()
          : tempDoc.html()

      console.log('after.predEdit', post.content)
    } catch (e) {
      console.log('preEdit.error', e)
    }
  }
}
