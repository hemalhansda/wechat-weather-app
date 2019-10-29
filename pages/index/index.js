const weatherMap = {
  'sunny': 'Sunny',
  'cloudy': 'Cloudy',
  'overcast': 'Overcast',
  'lightrain': 'Light rain',
  'heavyrain': 'Heavy rain',
  'snow': 'Snow'
};

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
};

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherbg: '',
    forecast: [],
    todayTemp: '',
    todayDate: ''
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
  },
  onLoad() {
    this.getNow();
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: 'sydney'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let result = res.data.result;
        this.setNow(result);
        this.setHourlyForecast(result);
        this.setToday(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },
  setNow (result) {
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTemp: temp,
      nowWeather: weatherMap[weather],
      nowWeatherbg: '/images/' + weather + '-bg.png'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    });
  },
  setHourlyForecast(result) {
    let forecast = result.forecast;
    let hourlyWeather = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + ':00',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + 'º'
      });
    }
    hourlyWeather[0].time = 'Now';
    this.setData({
      hourlyWeather: hourlyWeather
    }); 
  },
  setToday(result) {
    let date = new Date();
    this.setData({
      todayTemp: `${result.today.minTemp}º - ${result.today.maxTemp}º`, 
      todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} Today`
    });
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})