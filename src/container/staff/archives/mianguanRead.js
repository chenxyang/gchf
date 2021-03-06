import React from 'react';
import axios from 'axios';
import './mianguanRead.css';

class mianguanRead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        'text': '',
        'mediaStreamTrack': '',
        'feat': ''
    };
    this.openVideo = this.openVideo.bind(this);
    this.cutImg = this.cutImg.bind(this);
    this.getFeat = this.getFeat.bind(this);
    // this.clickImg = this.clickImg.bind(this);
    // this.kaoqin = this.kaoqin.bind(this);
    this.next = this.next.bind(this);
    this.submitBtn = this.submitBtn.bind(this);
  }
  componentDidMount() {
  // 获取媒体方法（旧方法）
      navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.video = document.getElementById('video');
      this.mediaStreamTrack = '';
      this.openVideo();
  };
  next() {
    this.props.history.push(`/staff/jiandang/idInfoRead`);
  };
  // 打开摄像头
  openVideo(argument) {
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            this.mediaStreamTrack = typeof (stream.stop) === 'function' ? stream : stream.getTracks()[1];
            if (this.video.srcObject) {
                this.video.srcObject = stream;
            } else {
                this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(function() {
                this.video.play();
            }, 300);
        }).catch(function(err) {
            console.log(err);
        });
    } else if (navigator.getMedia) { // 使用旧方法打开摄像头
        navigator.getMedia({
            video: true
        }, (stream) => {
            this.mediaStreamTrack = stream.getTracks()[0];
            if (this.video.srcObject) {
                this.video.srcObject = stream;
            } else {
                this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(function() {
                this.video.play();
            }, 300);
        }, function(err) {
            console.log(err);
        });
    }
  };
  // 截取图像
  cutImg() {
    document.getElementById('userImg').style.display = 'none';
    document.getElementById('canvas').style.display = 'display';
    this.context.drawImage(this.video, 0, 0, 285, 285);
  };
  getPixelRatio() {
    var backingStore = this.context.backingStorePixelRatio ||
    this.context.webkitBackingStorePixelRatio ||
    this.context.mozBackingStorePixelRatio ||
    this.context.msBackingStorePixelRatio ||
    this.context.oBackingStorePixelRatio ||
    this.context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  };
  getFeat() {
    axios.post('/getfeature', this.canvas.toDataURL('image/jpeg'))
        .then((rs) => {
            var result = /getFaceFeature\({data:([^]+)}\)/.exec(rs);
            if (!result || result[1] === 'NOFACE') {
                alert('请对准人脸');
                return;
            };
            this.setState({
                feat: result[1]
            });
            console.log(result);
        });
  };
  submitBtn (e) {
    e.preventDefault();
    var info = {};
    if (this.state.feat) {
        info.feat = this.state.feat;
        info.pic1 = this.canvas.toDataURL('image/jpeg');
        this.upload(info);
    } else if (!this.state.feat) {
        alert('请重新拍摄');
    };
};
upload(info) {
    info.idKind = 1;
    axios.post('/api', {
        code: 631411,
        json: JSON.stringify(info)
    }).then(rs => {
        if (rs.errorCode === '0') {
            alert('提交成功');
            this.props.history.push(`/staff/jiandang/salaryCard`);
        } else {
            alert(rs.errorInfo || '提交失败');
        }
    });
};

  render() {
    const url = './touxiang.png';
    return (
      <div className="SectionContainer" style={{ border: '2px solid #096dd9' }}>
        <div className="section">
            <div style={{ verticalAlign: 'middle', width: '100%' }}>
                <div className="comparison-main comparison-mains">
                <div className="head-wrap"><i></i>免冠照读取</div>
                    <div className="clearfix">
                        <div className="inner-box">
                            <div className="img-wrap left-img" style={{ display: 'none' }}>
                                <video id="video" className="video"></video>
                            </div>
                            <div className="img-wrap right-img" style={{ border: '1px solid #4c98de', display: 'block', margin: '0 auto' }}>
                                <img src="./user.png" className="userImg" id="userImg"/>
                                <canvas id="canvas" className="inner-item" width="285" height="285"></canvas>
                            </div>
                            <div style={{ paddingTop: 20 }}>
                                <div className="btn-item" style={{ textAlign: 'center' }}>
                                <div>
                                <button className="ant-btn ant-btn-primary ant-btn-lg" style={{ width: 285, marginBottom: 20, backgroundColor: '#4c98de', color: '#fff' }} id="cut" onClick={ () => { this.cutImg(); this.getFeat(); } }>截取图像</button>
                                </div>
                                <div>
                                <button className="ant-btn ant-btn-primary ant-btn-lg" style={{ width: 250 }} id="cut" onClick={ this.submitBtn }>下一步</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default mianguanRead;