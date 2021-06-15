
import md5 from 'md5'

class Identicoin {
    static defaultProps = {
        className: 'identicon',
        bg: 'transparent',
        count: 5,
        palette: null,
        fg: null,
        padding: 0,
        size: 40,
        getColor: null,
        string: ''
      };


    constructor(prop) {
        this.prop = Object.assign(Identicoin.defaultProps,  prop);
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.prop.size;
        this.canvas.height = this.prop.size;
        this.className = this.prop.className;
    }

    range (n, in_min, in_max, out_min, out_max) {
        return ((n - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    };

    toDataURL() {
        return this.canvas.toDataURL("image/png");
    }

    updateCanvas()  {
      let hash = md5(this.prop.string);
      let block = Math.floor(this.prop.size / this.prop.count);
      let hashcolor = hash.slice(0, 6);
  
      if (this.prop.palette && this.prop.palette.length) {
        let index = Math.floor(
          this.range(parseInt(hash.slice(-3), 16), 0, 4095, 0, this.prop.palette.length)
        );
        this.prop.fg = this.prop.palette[index];
      }
  
      if (this.prop.getColor) {
        this.prop.getColor(this.prop.fg || hashcolor);
      }
  
      let pad = this.prop.padding;
      this.canvas.width = block * this.prop.count + pad;
      this.canvas.height = block * this.prop.count + pad;
      let arr = hash.split('').map(el => {
        el = parseInt(el, 16);
        if (el < 8) {
          return 0;
        } else {
          return 1;
        }
      });
  
      let map = [];
  
      map[0] = map[4] = arr.slice(0, 5);
      map[1] = map[3] = arr.slice(5, 10);
      map[2] = arr.slice(10, 15);
  
      const ctx = this.canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      map.forEach((row, i) => {
        row.forEach((el, j) => {
          if (el) {
            ctx.fillStyle = this.fg ? this.fg : '#' + hashcolor;
            ctx.fillRect(
              block * i + pad,
              block * j + pad,
              block - pad,
              block - pad
            );
          } else {
            ctx.fillStyle = this.bg;
            ctx.fillRect(
              block * i + pad,
              block * j + pad,
              block - pad,
              block - pad
            );
          }
        });
      });
    };
}

export default Identicoin;