import i18next from "i18next";
import Router from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import shortid from "shortid";
import Cookies from "universal-cookie";
import * as storageHelper from "./local-storage-helper";
import { Modal, Button } from "antd";

var isModalOpen = true;

/* eslint-disable no-useless-escape */
export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export let PAGE_SIZE = 10;

/* validate if only number is entered */
export function validNumber(val) {
  return val === "" || (val.match(/[0-9]/) === null && !isNaN(parseInt(val)));
}

export function logout(type) {
  // if (isModalOpen == true && type != "fromLogout") {
  //   Modal.info({
  //     content: i18next.t("SESSION_LOGOUT_LABEL"),
  //     okText: i18next.t("OK_TEXT"),
  //   });
  // }
  // isModalOpen = false;
  storageHelper.setObj("userDetails", "");
  storageHelper.setObj("USER_DATA", "");
  Router.push("/");
}

export function showToast(msg) {
  console.log("toast..", msg);

  // toast.dismiss();
  // let message = msg ? msg : "";
  // toast.info(message, {
  //   position: toast.POSITION.TOP_RIGHT,
  //   // className: 'primary-color'
  // });
  toast(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export function getAWSUrl() {
  return "https://kuuush-prod.s3.ca-central-1.amazonaws.com";
}

export function getAppUrl() {
  return "https://www.kuuush.com";
  // return "https://stage.kuuush.com";
  // return "http://localhost:3000";
}

export function checkContentType(string) {
  if (string) {
    string = string.toLowerCase();
    if (
      string.includes("mp4") ||
      string.includes("mov") ||
      string.includes("wmv") ||
      string.includes("flv") ||
      string.includes("avi") ||
      string.includes("avchd") ||
      string.includes("webm") ||
      string.includes("mkv")
    ) {
      return "VIDEO";
    } else if (
      string.includes("jpeg") ||
      string.includes("jpg") ||
      string.includes("png") ||
      string.includes("tiff") ||
      string.includes("psd") ||
      string.includes("pdf") ||
      string.includes("eps") ||
      string.includes("ai") ||
      string.includes("indd") ||
      string.includes("raw")
    ) {
      return "IMAGE";
    } else if (
      string.includes("m4a") ||
      string.includes("flac") ||
      string.includes("mp3") ||
      string.includes("wav") ||
      string.includes("wma") ||
      string.includes("acc") ||
      string.includes("mpeg") ||
      string.includes("ogg")
    ) {
      return "AUDIO";
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function trimLeft(string) {
  if (string) {
    return string.replace(/^(\/)/, ""); //replace("/", "");
  } else {
    return string;
  }

}

export function replaceAllSpecialChars(string) {
  if (string) {
    let extension = string.split(".").pop();
    string = shortid.generate() + "." + extension;
    return string.replace(/\s+/g, "");
  } else {
    return string;
  }
}

export function getRelativeTimeNF(prevDate, item) {
  let lang;
  if(item && item.language_id){
    lang = item.language_id.code;
  }else{
    const cookies = new Cookies();
    if (cookies.get("language")) {
      lang = cookies.get("language");
    }
  }
  
  var diff = Number(new Date()) - Number(new Date(prevDate));
  var minute = 60 * 1000;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = day * 365;
  switch (true) {
    case diff < minute:
      var seconds = Math.round(diff / 1000);
      var msg;
      if (seconds > 1) {
        if (lang && lang == "bpr") {
          msg = "Séttiŋa" + " " + seconds;
        } else if (lang && lang == "en") {
          msg = seconds + " " + "seconds ago";
        }else if (lang && lang == "ar") {
          msg = seconds + " " + "ث";
        }

      } else if (seconds == 1) {
        if (lang && lang == "bpr") {
          msg = "Séttiŋ" + " " + seconds;
        } else if (lang && lang == "en") {
          msg = seconds + " " + "second ago";
        }else if (lang && lang == "ar") {
          msg = seconds + " " + "ث";
        }
      } else if (seconds < 1) {
        if (lang && lang == "bpr") {
          msg = "Naa bá";
        } else if (lang && lang == "en") {
          msg = "Just now";
        }else if (lang && lang == "ar") {
          msg = "الآن";
        }
      }
      return msg;
    case diff < hour:
      var msg;
      if (Math.round(diff / minute) > 1) {
        if (lang && lang == "bpr") {
          msg = "Selema" + " " + Math.round(diff / minute);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / minute) + " " + "minutes ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / minute) + " " + "د";
        }

      } else if (Math.round(diff / minute) == 1) {
        if (lang && lang == "bpr") {
          msg = "Selem" + " " + Math.round(diff / minute);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / minute) + " " + "minute ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / minute) + " " + "د";
        }
      }
      return msg;
    case diff < day:
      var msg;
      if (Math.round(diff / hour) > 1) {
        if (lang && lang == "bpr") {
          msg = "Tina" + " " + Math.round(diff / hour);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / hour) + " " + "hours ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / hour) + " " + "س";
        }
      } else if (Math.round(diff / hour) == 1) {
        if (lang && lang == "bpr") {
          msg = "Tin" + " " + Math.round(diff / hour);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / hour) + " " + "hour ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / hour) + " " + "س";
        }
      }
      return msg;
    case diff < month:
      var msg;
      if (Math.round(diff / day) > 1) {
        if (lang && lang == "bpr") {
          msg = "Soga" + " " + Math.round(diff / day);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / day) + " " + "days ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / day) + " " + "ي";
        }
      } else if (Math.round(diff / day) == 1) {
        if (lang && lang == "bpr") {
          msg = "Sog" + " " + Math.round(diff / day);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / day) + " " + "day ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / day) + " " + "ي";
        }
      }
      return msg;
    case diff < year:
      var msg;
      if (Math.round(diff / month) > 1) {
        if (lang && lang == "bpr") {
          msg = "Kôlda" + " " + Math.round(diff / month);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / month) + " " + "months ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / month) + " " + "ش";
        }
      } else if (Math.round(diff / month) == 1) {
        if (lang && lang == "bpr") {
          msg = "Dúal" + " " + Math.round(diff / month);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / month) + " " + "month ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / month) + " " + "ش";
        }
      }
      return msg;
    case diff > year:
      var msg;
      if (Math.round(diff / year) > 1) {
        if (lang && lang == "bpr") {
          msg = "Ayéŋá" + " " + Math.round(diff / year);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / year) + " " + "years ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / year) + " " + "سن";
        }
      } else if (Math.round(diff / year) == 1) {
        if (lang && lang == "bpr") {
          msg = "Ayé" + " " + Math.round(diff / year);
        } else if (lang && lang == "en") {
          msg = Math.round(diff / year) + " " + "year ago";
        }else if (lang && lang == "ar") {
          msg = Math.round(diff / year) + " " + "سن";
        }
      }
      return msg;
    default:
      return "";
  }
}

export function getRelativeTime(prevDate) {
  let lang;
  const cookies = new Cookies();
  if (cookies.get("language")) {
    lang = cookies.get("language");
  }
  var diff = Number(new Date()) - Number(new Date(prevDate));
  var minute = 60 * 1000;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = day * 365;
  switch (true) {
    case diff < minute:
      var seconds = Math.round(diff / 1000);
      var msg;
      if (seconds > 1) {
        if (lang && lang == "bpr") {
          msg = `${i18next.t("SECONDS_AGO_LABEL") + " " + seconds} `;
        } else {
          msg = `${seconds + " " + i18next.t("SECONDS_AGO_LABEL")} `;
        }
      } else if (seconds == 1) {
        if (lang && lang == "bpr") {
          msg = `${i18next.t("SECOND_AGO_LABEL") + " " + seconds}`;
        } else {
          msg = `${seconds + " " + i18next.t("SECOND_AGO_LABEL")}`;
        }
      } else if (seconds < 1) {
        msg = `${i18next.t("JUST_NOW_LABEL")}`;
      }
      return msg;
    case diff < hour:
      var msg;
      if (Math.round(diff / minute) > 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("MINUTES_AGO_LABEL") + " " + Math.round(diff / minute)
          }`;
        } else {
          msg = `${
            Math.round(diff / minute) + " " + i18next.t("MINUTES_AGO_LABEL")
          }`;
        }
      } else if (Math.round(diff / minute) == 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("MINUTE_AGO_LABEL") + " " + Math.round(diff / minute)
          }`;
        } else {
          msg = `${
            Math.round(diff / minute) + " " + i18next.t("MINUTE_AGO_LABEL")
          }`;
        }
      }
      return msg;
    // return Math.round(diff / minute) + ' minutes ago';
    case diff < day:
      var msg;
      if (Math.round(diff / hour) > 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("HOURS_AGO_LABEL") + " " + Math.round(diff / hour)
          }`;
        } else {
          msg = `${
            Math.round(diff / hour) + " " + i18next.t("HOURS_AGO_LABEL")
          }`;
        }
      } else if (Math.round(diff / hour) == 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("HOUR_AGO_LABEL") + " " + Math.round(diff / hour)
          }`;
        } else {
          msg = `${
            Math.round(diff / hour) + " " + i18next.t("HOUR_AGO_LABEL")
          }`;
        }
      }
      return msg;
    case diff < month:
      var msg;
      if (Math.round(diff / day) > 1) {
        if (lang && lang == "bpr") {
          msg = `${i18next.t("DAYS_AGO_LABEL") + " " + Math.round(diff / day)}`;
        } else {
          msg = `${Math.round(diff / day) + " " + i18next.t("DAYS_AGO_LABEL")}`;
        }
      } else if (Math.round(diff / day) == 1) {
        if (lang && lang == "bpr") {
          msg = `${i18next.t("DAY_AGO_LABEL") + " " + Math.round(diff / day)}`;
        } else {
          msg = `${Math.round(diff / day) + " " + i18next.t("DAY_AGO_LABEL")}`;
        }
      }
      return msg;
    case diff < year:
      var msg;
      if (Math.round(diff / month) > 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("MONTHS_AGO_LABEL") + " " + Math.round(diff / month)
          }`;
        } else {
          msg = `${
            Math.round(diff / month) + " " + i18next.t("MONTHS_AGO_LABEL")
          }`;
        }
      } else if (Math.round(diff / month) == 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("MONTH_AGO_LABEL") + " " + Math.round(diff / month)
          }`;
        } else {
          msg = `${
            Math.round(diff / month) + " " + i18next.t("MONTH_AGO_LABEL")
          }`;
        }
      }
      return msg;
    // return Math.round(diff / month) + ' months ago';
    case diff > year:
      var msg;
      if (Math.round(diff / year) > 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("YEARS_AGO_LABEL") + " " + Math.round(diff / year)
          }`;
        } else {
          msg = `${
            Math.round(diff / year) + " " + i18next.t("YEARS_AGO_LABEL")
          }`;
        }
      } else if (Math.round(diff / year) == 1) {
        if (lang && lang == "bpr") {
          msg = `${
            i18next.t("YEAR_AGO_LABEL") + " " + Math.round(diff / year)
          }`;
        } else {
          msg = `${
            Math.round(diff / year) + " " + i18next.t("YEAR_AGO_LABEL")
          }`;
        }
      }
      return msg;
    default:
      return "";
  }
}

export function getLangDirection() {
  return i18next.dir();
}

export function isUserBlocked() {
  const cookies = new Cookies();
  if (cookies.get('userDetails')) {
    return cookies.get('userDetails').is_block;
  }
}

export function getLanguage() {
  let lang;
  const cookies = new Cookies();
  if (cookies.get("language")) {
    return cookies.get("language");
  }
}

export function getBelepoorDate(date, from) {
  let monthStr;
  let dobStr;

  let currentDate = new Date(date);
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let year = currentDate.getFullYear();

  if (month == 1) {
    monthStr = "Taan";
  } else if (month == 2) {
    monthStr = "Noy";
  } else if (month == 3) {
    monthStr = "Sǔb";
  } else if (month == 4) {
    monthStr = "Kǒs";
  } else if (month == 5) {
    monthStr = "Dor";
  } else if (month == 6) {
    monthStr = "Pot";
  } else if (month == 7) {
    monthStr = "Kuy";
  } else if (month == 8) {
    monthStr = "Kor";
  } else if (month == 9) {
    monthStr = "Ʉró";
  } else if (month == 10) {
    monthStr = "Ede";
  } else if (month == 11) {
    monthStr = "Taá";
  } else if (month == 12) {
    monthStr = "Taad";
  }

  if (from === "DOB") {
    dobStr = monthStr + " " + day + ", " + year;
    return dobStr;
  } else if (from == "POST") {
    let hours =
      currentDate.getHours() > 12
        ? currentDate.getHours() - 12
        : currentDate.getHours();
    let am_pm = currentDate.getHours() >= 12 ? "ar" : "su";
    hours = hours < 10 ? "0" + hours : hours;
    let minutes =
      currentDate.getMinutes() < 10
        ? "0" + currentDate.getMinutes()
        : currentDate.getMinutes();
    let seconds =
      currentDate.getSeconds() < 10
        ? "0" + currentDate.getSeconds()
        : currentDate.getSeconds();
    let timeStr = hours + ":" + minutes + " " + am_pm;
    let postDateStr = day + " " + monthStr + " " + "tin " + timeStr;
    return postDateStr;
  }
}

export function clearNotificationData() {
  storageHelper.setObj("NotificationClick", "");
}

export function handleNotificationNavigation(data, isHeader) {
  console.log("data", data)
  let appPath = getAppUrl();
  let path = "";
  if (data && data.owner_type) {
    switch (data.owner_type) {
      case "User":
        if (isHeader) {
          path = `/profile/${data.friend_id._id}`;
        } else {
          path = `/profile/${data.friend_id}`;
        }
        break;
      case "Page":
        path = `/post/${data.action_id}`;
        break;
      case "Post":
        if (isHeader && data.action == "Comment") {
          path = `/post/${data.owner._id}`;
        } else if (data.action == "Comment") {
          path = `/post/${data.owner}`;
        } else {
          path = `/post/${data.action_id}`;
        }
        break;
      case "Hierarchy":
        path = `/hierarchy/${data.super_parent_id}`;
        break;
      default:
        path = "";
    }
  }
  if (isHeader) {
    return appPath + path;
  } else {
    let url = appPath + path;
    let a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export function translatePageCategory(data) {
    if(data == "Business"){
      return i18next.t("PC_BUSINESS_LABEL");

    }else if(data == "Community"){
      return i18next.t("PC_COMMUNITY_LABEL");

    }else if(data == "Education"){
      return i18next.t("PC_EDUCATION_LABEL");

    }else if(data == "Media"){
      return i18next.t("PC_MEDIA_LABEL");

    }else if(data == "Sports"){
      return i18next.t("PC_SPORT_LABEL");

    }else if(data == "Singer"){
      return i18next.t("PC_SINGER_LABEL");

    }else if(data == "Politician"){
      return i18next.t("PC_POLITICIAN_LABEL");

    }else if(data == "Health"){
      return i18next.t("PC_HEALTH_LABEL");

    }else if(data == "Comedian"){
      return i18next.t("PC_COMEDIAN_LABEL");

    }else if (data == "Other"){
      return i18next.t("OTHER_LABEL");

    }else{
        return data;
    }
}
