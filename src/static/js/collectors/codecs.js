async function collectCodecs() {
    const v = document.createElement("video");
    const a = document.createElement("audio");

    function normalize(val) {
        return val || ""; // normalize undefined → ""
    }

    return {
        codecs: {
            containers: {
                mp4: normalize(v.canPlayType("video/mp4")),
                webm: normalize(v.canPlayType("video/webm")),
                ogg: normalize(a.canPlayType("audio/ogg")),
            },
            video: {
                h264: normalize(v.canPlayType('video/mp4; codecs="avc1.42E01E"')),
                vp8: normalize(v.canPlayType('video/webm; codecs="vp8"')),
                vp9: normalize(v.canPlayType('video/webm; codecs="vp9"')),
                av1: normalize(v.canPlayType('video/mp4; codecs="av01.0.04M.08"')),
                hevc: normalize(v.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"')),
                theora: normalize(v.canPlayType('video/ogg; codecs="theora"')),
            },
            audio: {
                mp3: normalize(a.canPlayType("audio/mpeg")),
                aac: normalize(a.canPlayType("audio/aac")),
                opus: normalize(a.canPlayType('audio/ogg; codecs="opus"')),
                flac: normalize(a.canPlayType("audio/flac")),
                webm_opus: normalize(a.canPlayType('audio/webm; codecs="opus"')),
            }
        }
    };
}
