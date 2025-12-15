const os = require("os");
const http = require("http");
const fs = require("fs");
const axios = require("axios");
const net = require("net");
const path = require("path");
const crypto = require("crypto");
const {
  Buffer
} = require("buffer");
const {
  exec,
  execSync
} = require("child_process");
const {
  WebSocket,
  createWebSocketStream
} = require("ws");
const UUID = process.env.UUID || "c2ba8766-c7e0-46f0-854a-d41e3ef37572";
const NEZHA_SERVER = process.env.NEZHA_SERVER || "";
const NEZHA_PORT = process.env.NEZHA_PORT || "";
const NEZHA_KEY = process.env.NEZHA_KEY || "";
const DOMAIN = process.env.DOMAIN || "1234.abc.com";
const AUTO_ACCESS = process.env.AUTO_ACCESS || true;
const WSPATH = process.env.WSPATH || UUID.slice(0, 8);
const SUB_PATH = process.env.SUB_PATH || "chenjingxiu";
const NAME = process.env.NAME || "Hug";
const PORT = process.env.PORT || 7860;
let ISP = "";
const GetISP = async () => {
  try {
    const _0x23bd7d = await axios.get("https://speed.cloudflare.com/meta");
    const _0xd2467b = _0x23bd7d.data;
    ISP = (_0xd2467b.country + "-" + _0xd2467b.asOrganization).replace(/ /g, "_");
  } catch (_0x558e8f) {
    ISP = "Unknown";
  }
};
GetISP();
const httpServer = http.createServer((_0x5d8d5c, _0x49ee3c) => {
  if (_0x5d8d5c.url === "/") {
    const _0x2acb8e = path.join(__dirname, "index.html");
    fs.readFile(_0x2acb8e, "utf8", (_0x3fee75, _0x312420) => {
      if (_0x3fee75) {
        _0x49ee3c.writeHead(200, {
          "Content-Type": "text/html"
        });
        _0x49ee3c.end("Hello world!");
        return;
      }
      _0x49ee3c.writeHead(200, {
        "Content-Type": "text/html"
      });
      _0x49ee3c.end(_0x312420);
    });
    return;
  } else if (_0x5d8d5c.url === "/" + SUB_PATH) {
    const _0x22c8fa = "vless://" + UUID + "@" + DOMAIN + ":443?encryption=none&security=tls&sni=" + DOMAIN + "&fp=chrome&type=ws&host=" + DOMAIN + "&path=%2F" + WSPATH + "#" + NAME + "-" + ISP;
    const _0x259990 = "trojan://" + UUID + "@" + DOMAIN + ":443?security=tls&sni=" + DOMAIN + "&fp=chrome&type=ws&host=" + DOMAIN + "&path=%2F" + WSPATH + "#" + NAME + "-" + ISP;
    const _0x105230 = _0x22c8fa + "\n" + _0x259990;
    const _0x26fcc4 = Buffer.from(_0x105230).toString("base64");
    _0x49ee3c.writeHead(200, {
      "Content-Type": "text/plain"
    });
    _0x49ee3c.end(_0x26fcc4 + "\n");
  } else {
    _0x49ee3c.writeHead(404, {
      "Content-Type": "text/plain"
    });
    _0x49ee3c.end("Not Found\n");
  }
});
const _0x47b56d = {
  server: httpServer
};
const wss = new WebSocket.Server(_0x47b56d);
const uuid = UUID.replace(/-/g, "");
const DNS_SERVERS = ["8.8.4.4", "1.1.1.1"];
function resolveHost(_0x4dd56f) {
  return new Promise((_0x43ec3a, _0x4e7fa6) => {
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(_0x4dd56f)) {
      _0x43ec3a(_0x4dd56f);
      return;
    }
    let _0x57dcbc = 0;
    function _0x1b8c43() {
      if (_0x57dcbc >= DNS_SERVERS.length) {
        _0x4e7fa6(new Error("Failed to resolve " + _0x4dd56f + " with all DNS servers"));
        return;
      }
      const _0x102d36 = DNS_SERVERS[_0x57dcbc];
      _0x57dcbc++;
      const _0x16d29c = "https://dns.google/resolve?name=" + encodeURIComponent(_0x4dd56f) + "&type=A";
      axios.get(_0x16d29c, {
        timeout: 5000,
        headers: {
          Accept: "application/dns-json"
        }
      }).then(_0x423fe3 => {
        const _0x1de0b1 = _0x423fe3.data;
        if (_0x1de0b1.Status === 0 && _0x1de0b1.Answer && _0x1de0b1.Answer.length > 0) {
          const _0x31573c = _0x1de0b1.Answer.find(_0x36c4bb => _0x36c4bb.type === 1);
          if (_0x31573c) {
            _0x43ec3a(_0x31573c.data);
            return;
          }
        }
        _0x1b8c43();
      }).catch(_0x1a1309 => {
        _0x1b8c43();
      });
    }
    _0x1b8c43();
  });
}
function handleVlessConnection(_0x3db2cd, _0x3f9a09) {
  const [_0x3b9c1d] = _0x3f9a09;
  const _0x101e0d = _0x3f9a09.slice(1, 17);
  if (!_0x101e0d.every((_0x33b9ff, _0xf64688) => _0x33b9ff == parseInt(uuid.substr(_0xf64688 * 2, 2), 16))) {
    return false;
  }
  let _0x2f7e38 = _0x3f9a09.slice(17, 18).readUInt8() + 19;
  const _0xdbadea = _0x3f9a09.slice(_0x2f7e38, _0x2f7e38 += 2).readUInt16BE(0);
  const _0x15b44f = _0x3f9a09.slice(_0x2f7e38, _0x2f7e38 += 1).readUInt8();
  const _0x294096 = _0x15b44f == 1 ? _0x3f9a09.slice(_0x2f7e38, _0x2f7e38 += 4).join(".") : _0x15b44f == 2 ? new TextDecoder().decode(_0x3f9a09.slice(_0x2f7e38 + 1, _0x2f7e38 += 1 + _0x3f9a09.slice(_0x2f7e38, _0x2f7e38 + 1).readUInt8())) : _0x15b44f == 3 ? _0x3f9a09.slice(_0x2f7e38, _0x2f7e38 += 16).reduce((_0x2d79be, _0x41f210, _0x15edcf, _0x97f774) => _0x15edcf % 2 ? _0x2d79be.concat(_0x97f774.slice(_0x15edcf - 1, _0x15edcf + 1)) : _0x2d79be, []).map(_0x271276 => _0x271276.readUInt16BE(0).toString(16)).join(":") : "";
  _0x3db2cd.send(new Uint8Array([_0x3b9c1d, 0]));
  const _0x2e7ad9 = createWebSocketStream(_0x3db2cd);
  resolveHost(_0x294096).then(_0x4ccdef => {
    const _0x349215 = {
      host: _0x4ccdef,
      port: _0xdbadea
    };
    net.connect(_0x349215, function () {
      this.write(_0x3f9a09.slice(_0x2f7e38));
      _0x2e7ad9.on("error", () => {}).pipe(this).on("error", () => {}).pipe(_0x2e7ad9);
    }).on("error", () => {});
  }).catch(_0x2d1222 => {
    const _0x5c5500 = {
      host: _0x294096,
      port: _0xdbadea
    };
    net.connect(_0x5c5500, function () {
      this.write(_0x3f9a09.slice(_0x2f7e38));
      _0x2e7ad9.on("error", () => {}).pipe(this).on("error", () => {}).pipe(_0x2e7ad9);
    }).on("error", () => {});
  });
  return true;
}
function handleTrojanConnection(_0x2d811f, _0x3c7f77) {
  try {
    if (_0x3c7f77.length < 58) {
      return false;
    }
    const _0x26e46a = _0x3c7f77.slice(0, 56).toString();
    const _0x4eb9f8 = [UUID];
    let _0x39d60a = null;
    for (const _0x436ed6 of _0x4eb9f8) {
      const _0x1c6e82 = crypto.createHash("sha224").update(_0x436ed6).digest("hex");
      if (_0x1c6e82 === _0x26e46a) {
        _0x39d60a = _0x436ed6;
        break;
      }
    }
    if (!_0x39d60a) {
      return false;
    }
    let _0x4710de = 56;
    if (_0x3c7f77[_0x4710de] === 13 && _0x3c7f77[_0x4710de + 1] === 10) {
      _0x4710de += 2;
    }
    const _0x43ea9f = _0x3c7f77[_0x4710de];
    if (_0x43ea9f !== 1) {
      return false;
    }
    _0x4710de += 1;
    const _0x2e3363 = _0x3c7f77[_0x4710de];
    _0x4710de += 1;
    let _0x4fbeba;
    let _0x593873;
    if (_0x2e3363 === 1) {
      _0x4fbeba = _0x3c7f77.slice(_0x4710de, _0x4710de + 4).join(".");
      _0x4710de += 4;
    } else if (_0x2e3363 === 3) {
      const _0x3a8af6 = _0x3c7f77[_0x4710de];
      _0x4710de += 1;
      _0x4fbeba = _0x3c7f77.slice(_0x4710de, _0x4710de + _0x3a8af6).toString();
      _0x4710de += _0x3a8af6;
    } else if (_0x2e3363 === 4) {
      _0x4fbeba = _0x3c7f77.slice(_0x4710de, _0x4710de + 16).reduce((_0xfa6b0, _0x5ca712, _0x50db34, _0x4853e7) => _0x50db34 % 2 ? _0xfa6b0.concat(_0x4853e7.slice(_0x50db34 - 1, _0x50db34 + 1)) : _0xfa6b0, []).map(_0x508db2 => _0x508db2.readUInt16BE(0).toString(16)).join(":");
      _0x4710de += 16;
    } else {
      return false;
    }
    _0x593873 = _0x3c7f77.readUInt16BE(_0x4710de);
    _0x4710de += 2;
    if (_0x4710de < _0x3c7f77.length && _0x3c7f77[_0x4710de] === 13 && _0x3c7f77[_0x4710de + 1] === 10) {
      _0x4710de += 2;
    }
    const _0x3ba987 = createWebSocketStream(_0x2d811f);
    resolveHost(_0x4fbeba).then(_0xbdc758 => {
      const _0x450896 = {
        host: _0xbdc758,
        port: _0x593873
      };
      net.connect(_0x450896, function () {
        if (_0x4710de < _0x3c7f77.length) {
          this.write(_0x3c7f77.slice(_0x4710de));
        }
        _0x3ba987.on("error", () => {}).pipe(this).on("error", () => {}).pipe(_0x3ba987);
      }).on("error", () => {});
    }).catch(_0x15df4f => {
      const _0x2f62b7 = {
        host: _0x4fbeba,
        port: _0x593873
      };
      net.connect(_0x2f62b7, function () {
        if (_0x4710de < _0x3c7f77.length) {
          this.write(_0x3c7f77.slice(_0x4710de));
        }
        _0x3ba987.on("error", () => {}).pipe(this).on("error", () => {}).pipe(_0x3ba987);
      }).on("error", () => {});
    });
    return true;
  } catch (_0x2d56ad) {
    return false;
  }
}
wss.on("connection", (_0x357061, _0x37bd11) => {
  const _0x11d59c = _0x37bd11.url || "";
  _0x357061.once("message", _0x273b27 => {
    if (_0x273b27.length > 17 && _0x273b27[0] === 0) {
      const _0x10487b = _0x273b27.slice(1, 17);
      const _0x5b0a10 = _0x10487b.every((_0x42d744, _0x42fb38) => _0x42d744 == parseInt(uuid.substr(_0x42fb38 * 2, 2), 16));
      if (_0x5b0a10) {
        if (!handleVlessConnection(_0x357061, _0x273b27)) {
          _0x357061.close();
        }
        return;
      }
    }
    if (!handleTrojanConnection(_0x357061, _0x273b27)) {
      _0x357061.close();
    }
  }).on("error", () => {});
});
const getDownloadUrl = () => {
  const _0x2eaf58 = os.arch();
  if (_0x2eaf58 === "arm" || _0x2eaf58 === "arm64" || _0x2eaf58 === "aarch64") {
    if (!NEZHA_PORT) {
      return "https://arm64.ssss.nyc.mn/v1";
    } else {
      return "https://arm64.ssss.nyc.mn/agent";
    }
  } else if (!NEZHA_PORT) {
    return "https://amd64.ssss.nyc.mn/v1";
  } else {
    return "https://amd64.ssss.nyc.mn/agent";
  }
};
const downloadFile = async () => {
  if (!NEZHA_SERVER && !NEZHA_KEY) {
    return;
  }
  try {
    const _0x3dabfc = getDownloadUrl();
    const _0x544be5 = await axios({
      method: "get",
      url: _0x3dabfc,
      responseType: "stream"
    });
    const _0x536a4a = fs.createWriteStream("npm");
    _0x544be5.data.pipe(_0x536a4a);
    return new Promise((_0x40f4a6, _0x4cb855) => {
      _0x536a4a.on("finish", () => {
        console.log("npm download successfully");
        exec("chmod +x npm", _0x166d47 => {
          if (_0x166d47) {
            _0x4cb855(_0x166d47);
          }
          _0x40f4a6();
        });
      });
      _0x536a4a.on("error", _0x4cb855);
    });
  } catch (_0x1f0c08) {
    throw _0x1f0c08;
  }
};
const runnz = async () => {
  try {
    const _0x2dc6ce = execSync("ps aux | grep -v \"grep\" | grep \"./[n]pm\"", {
      encoding: "utf-8"
    });
    if (_0x2dc6ce.trim() !== "") {
      console.log("npm is already running, skip running...");
      return;
    }
  } catch (_0x61f59a) {}
  await downloadFile();
  let _0x448363 = "";
  let _0x1727fc = ["443", "8443", "2096", "2087", "2083", "2053"];
  if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
    const _0x54d35e = _0x1727fc.includes(NEZHA_PORT) ? "--tls" : "";
    _0x448363 = "setsid nohup ./npm -s " + NEZHA_SERVER + ":" + NEZHA_PORT + " -p " + NEZHA_KEY + " " + _0x54d35e + " --disable-auto-update --report-delay 4 --skip-conn --skip-procs >/dev/null 2>&1 &";
  } else if (NEZHA_SERVER && NEZHA_KEY) {
    if (!NEZHA_PORT) {
      const _0x347d0f = NEZHA_SERVER.includes(":") ? NEZHA_SERVER.split(":").pop() : "";
      const _0x4d9f9c = _0x1727fc.includes(_0x347d0f) ? "true" : "false";
      const _0xa8bbf8 = "client_secret: " + NEZHA_KEY + `
debug: false
disable_auto_update: true
disable_command_execute: false
disable_force_update: true
disable_nat: false
disable_send_query: false
gpu: false
insecure_tls: true
ip_report_period: 1800
report_delay: 4
server: ` + NEZHA_SERVER + `
skip_connection_count: true
skip_procs_count: true
temperature: false
tls: ` + _0x4d9f9c + `
use_gitee_to_upgrade: false
use_ipv6_country_code: false
uuid: ` + UUID;
      fs.writeFileSync("config.yaml", _0xa8bbf8);
    }
    _0x448363 = "setsid nohup ./npm -c config.yaml >/dev/null 2>&1 &";
  } else {
    console.log("NEZHA variable is empty, skip running");
    return;
  }
  try {
    exec(_0x448363, {
      shell: "/bin/bash"
    }, _0x2425f9 => {
      if (_0x2425f9) {
        console.error("npm running error:", _0x2425f9);
      } else {
        console.log("npm is running");
      }
    });
  } catch (_0x1096f3) {
    console.error("error: " + _0x1096f3);
  }
};
async function addAccessTask() {
  if (!AUTO_ACCESS) {
    return;
  }
  if (!DOMAIN) {
    return;
  }
  const _0xc73d4e = "https://" + DOMAIN;
  try {
    const _0x2465ce = {
      url: _0xc73d4e
    };
    const _0x597c85 = await axios.post("https://oooo.serv00.net/add-url", _0x2465ce, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("Automatic Access Task added successfully");
  } catch (_0x1cf024) {}
}
const delFiles = () => {
  fs.unlink("npm", () => {});
  fs.unlink("config.yaml", () => {});
};
httpServer.listen(PORT, () => {
  runnz();
  // TOLOOK
  setTimeout(() => {
    delFiles();
  }, 180000);
  addAccessTask();
  console.log("Server is running on port " + PORT);
});
