var LunarDate = {
  madd: new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334),
  HsString: "甲乙丙丁戊己庚辛壬癸",
  EbString: "子丑寅卯辰巳午未申酉戌亥",
  NumString: "一二三四五六七八九十",
  MonString: "正二三四五六七八九十冬腊",
  CalendarData: new Array(
    0xa4b,
    0x5164b,
    0x6a5,
    0x6d4,
    0x415b5,
    0x2b6,
    0x957,
    0x2092f,
    0x497,
    0x60c96,
    0xd4a,
    0xea5,
    0x50da9,
    0x5ad,
    0x2b6,
    0x3126e,
    0x92e,
    0x7192d,
    0xc95,
    0xd4a,
    0x61b4a,
    0xb55,
    0x56a,
    0x4155b,
    0x25d,
    0x92d,
    0x2192b,
    0xa95,
    0x71695,
    0x6ca,
    0xb55,
    0x50ab5,
    0x4da,
    0xa5b,
    0x30a57,
    0x52b,
    0x8152a,
    0xe95,
    0x6aa,
    0x615aa,
    0xab5,
    0x4b6,
    0x414ae,
    0xa57,
    0x526,
    0x31d26,
    0xd95,
    0x70b55,
    0x56a,
    0x96d,
    0x5095d,
    0x4ad,
    0xa4d,
    0x41a4d,
    0xd25,
    0x81aa5,
    0xb54,
    0xb6a,
    0x612da,
    0x95b,
    0x49b,
    0x41497,
    0xa4b,
    0xa164b,
    0x6a5,
    0x6d4,
    0x615b4,
    0xab6,
    0x957,
    0x5092f,
    0x497,
    0x64b,
    0x30d4a,
    0xea5,
    0x80d65,
    0x5ac,
    0xab6,
    0x5126d,
    0x92e,
    0xc96,
    0x41a95,
    0xd4a,
    0xda5,
    0x20b55,
    0x56a,
    0x7155b,
    0x25d,
    0x92d,
    0x5192b,
    0xa95,
    0xb4a,
    0x416aa,
    0xad5,
    0x90ab5,
    0x4ba,
    0xa5b,
    0x60a57,
    0x52b,
    0xa93,
    0x40e95
  ),
  Year: null,
  Month: null,
  Day: null,
  TheDate: null,
  GetBit: function (m, n) {
    return (m >> n) & 1;
  },
  e2c: function () {
    this.TheDate =
      arguments.length != 3
        ? new Date()
        : new Date(arguments[0], arguments[1], arguments[2]);
    var total, m, n, k;
    var isEnd = false;
    var tmp = this.TheDate.getFullYear();
    total =
      (tmp - 1921) * 365 +
      Math.floor((tmp - 1921) / 4) +
      this.madd[this.TheDate.getMonth()] +
      this.TheDate.getDate() -
      38;
    if (this.TheDate.getYear() % 4 == 0 && this.TheDate.getMonth() > 1) {
      total++;
    }
    for (m = 0; ; m++) {
      k = this.CalendarData[m] < 0xfff ? 11 : 12;
      for (n = k; n >= 0; n--) {
        if (total <= 29 + this.GetBit(this.CalendarData[m], n)) {
          isEnd = true;
          break;
        }
        total = total - 29 - this.GetBit(this.CalendarData[m], n);
      }
      if (isEnd) break;
    }
    this.Year = 1921 + m;
    this.Month = k - n + 1;
    this.Day = total;
    if (k == 12) {
      if (this.Month == Math.floor(this.CalendarData[m] / 0x10000) + 1) {
        this.Month = 1 - this.Month;
      }
      if (this.Month > Math.floor(this.CalendarData[m] / 0x10000) + 1) {
        this.Month--;
      }
    }
  },
  GetcDateString: function () {
    var tmp = "";
    tmp += this.HsString.charAt((this.Year - 4) % 10);
    tmp += this.EbString.charAt((this.Year - 4) % 12);
    tmp += "年 ";
    if (this.Month < 1) {
      tmp += "(闰)";
      tmp += this.MonString.charAt(-this.Month - 1);
    } else {
      tmp += this.MonString.charAt(this.Month - 1);
    }
    tmp += "月";
    tmp +=
      this.Day < 11
        ? "初"
        : this.Day < 20
        ? "十"
        : this.Day < 30
        ? "廿"
        : "三十";
    if (this.Day % 10 != 0 || this.Day == 10) {
      tmp += this.NumString.charAt((this.Day - 1) % 10);
    }
    return tmp;
  },
  GetLunarDay: function (solarYear, solarMonth, solarDay) {
    if (solarYear < 1921 || solarYear > 2020) {
      return "";
    } else {
      solarMonth = parseInt(solarMonth) > 0 ? solarMonth - 1 : 11;
      this.e2c(solarYear, solarMonth, solarDay);
      return this.GetcDateString();
    }
  },
};

function dozodiacsearch(year, month, day, zodiacList) {
  if (year.length <= 0 || month.length <= 0 || day.length <= 0) {
    return false;
  }

  LunarDate.GetLunarDay(year, month, day);
  const lunarYear = LunarDate.Year;
  const remainder = (lunarYear - 1900) % 12;
  return zodiacList[remainder];
}

module.exports = dozodiacsearch;
