/* global ReactDOM React  */

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ct: {
        control: 1,
        speed: 1,
        size: 1,
        show: "Pause",
        cols: 20,
        rows: 20,
        running: true,
      },
      out: {
        gen: 0,
        lives: 0
      },
      grid: [],
      onoff: undefined,
    };
    this.clickControl = this.clickControl.bind(this);
    this.run = this.run.bind(this);
    this.clickCell = this.clickCell.bind(this);
  }
  clear(type) {
    let h = window.getNewGrid(type, this.state.ct.cols, this.state.ct.rows);
    this.state.grid = h[0];
    this.state.out.lives = h[1];
    this.state.out.gen = 0;
    this.setState = ({
      grid: this.state.grid,
      out: this.state.out
    });
  }
  componentWillMount() {
    let h = window.getNewGrid("random", this.state.ct.cols, this.state.ct.rows);
    this.state.grid = h[0];
    this.state.out.lives = h[1];
    this.state.out.gen = 0;
    this.setState = ({
      grid: this.state.grid,
      out: this.state.out
    });
  }
  componentDidMount() {
    this.run();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.state.onoff);
  }
  run() {
    const fps = [0.5, 1, 3];
    setTimeout(() => {
      if (this.state.ct.running) {
        this.updateGeneration();
      }
      this.state.onoff = requestAnimationFrame(this.run);
    }, 1000 / fps[this.state.ct.speed]);
  }
  updateGeneration() {
    let g = this.state.grid;
    let g2 = this.state.grid;
    let lives = this.state.out.lives;
    for (let x = 0; x < this.state.ct.cols; x++) {
      for (let y = 0; y < this.state.ct.rows; y++) {
        let neighbors = this.getNeighbors(g, x, y);
        if (g[x][y] === 0 && neighbors === 3) {
          g2[x][y] = 1;
          lives++;
        } else if (g[x][y] === 1) {
          if (neighbors < 2) {
            g2[x][y] = 0;
            lives--;
          } else if (neighbors > 3) {
            g2[x][y] = 0;
            lives--;
          }
        }
      }
    }
    this.state.grid = g;
    this.state.out.gen++;
    this.state.out.lives = lives;
    this.setState = ({
      grid: this.state.grid,
      out: this.state.out
    });
    this.forceUpdate();
  }
  getNeighbors(g, x, y) {
    let cols = this.state.ct.cols;
    let rows = this.state.ct.rows;
    let neighbors = 0;
    let i, j;
    if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) { // INSIDE
      for (i = x - 1; i < x + 2; i++) {
        for (j = y - 1; j < y + 2; j++) {
          posibleNeighbor();
        }
      }
    } else if (x === 0 && y > 0 && y < rows - 1) { // WEST NO CORNERS
      for (i = x; i < x + 2; i++) {
        for (j = y - 1; j < y + 2; j++) {
          posibleNeighbor();
        }
      }
    } else if (x === cols - 1 && y > 0 && y < rows - 1) { // EAST NO CORNERS
      for (i = x - 1; i < x + 1; i++) {
        for (j = y - 1; j < y + 2; j++) {
          posibleNeighbor();
        }
      }
    } else if (y === 0 && x > 0 && x < cols - 1) { // NORTH NO CORNERS
      for (i = x - 1; i < x + 2; i++) {
        for (j = y; j < y + 2; j++) {
          posibleNeighbor();
        }
      }
    } else if (y === rows - 1 && x > 0 && x < cols - 1) { // SOUTH NO CORNERS
      for (i = x - 1; i < x + 2; i++) {
        for (j = y - 1; j < y + 1; j++) {
          posibleNeighbor();
        }
      }
    } else if (x === 0 && y === 0) { // NW CORNER
      for (i = x; i < x + 2; i++) {
        for (j = y; j < y + 2; j++) {
          posibleNeighbor();
        }
      }
    } else if (x === cols - 1 && y === 0) { // NE CORNER
      for (i = x - 1; i < x + 1; i++) {
        for (j = y; j < y + 2; j++) {
          posibleNeighbor();
        }
      }
    } else if (x === cols - 1 && y === rows - 1) { // SE CORNER
      for (i = x - 1; i < x + 1; i++) {
        for (j = y - 1; j < y + 1; j++) {
          posibleNeighbor();
        }
      }
    } else if (x === 0 && y === rows - 1) { // SW CORNER
      for (i = x; i < x + 2; i++) {
        for (j = y - 1; j < y + 1; j++) {
          posibleNeighbor();
        }
      }
    }

    function posibleNeighbor() {
      if (i !== x || j !== y) {
        if (g[i][j] === 1) neighbors++;
      }
    }
    return neighbors;
  }
  clickControl(e) {
    const option = e.target.id;
    const sizes = [[20, 20], [50, 40], [80, 50]];
    switch (parseInt(option)) {
      case 0:
        this.state.ct.control = 1;
        this.componentWillMount();
        break;
      case 1:
        this.state.ct.control = 2;
        if (this.state.ct.show === "Pause") {
          this.state.ct.show = "Resume";
          this.state.ct.running = false;
        } else {
          this.state.ct.show = "Pause";
          this.state.ct.running = true;
        }
        break;
      case 2:
        this.state.ct.control = 3;
        this.clear("cls");
        break;
      case 3:
      case 4:
      case 5:
        this.state.ct.speed = parseInt(option) - 2;
        break;
      case 6:
      case 7:
      case 8:
        this.state.ct.size = parseInt(option) - 5;
        this.state.ct.cols = sizes[parseInt(option) - 6][0];
        this.state.ct.rows = sizes[parseInt(option) - 6][1];
        this.clear("cls");
        this.state.ct.control = 1;
        this.componentWillMount();
        break;
      default:
        console.log('Not recognized event => ', option);
    }
    this.setState = ({ ct: this.state.ct });
    this.forceUpdate();
  }
  clickCell(e) {
    if (this.state.ct.show !== "Resume") {
      return;
    }
    let Xcell = e.target.id.split(":")[0];
    let Ycell = e.target.id.split(":")[1];
    if (this.state.grid[Xcell][Ycell] === 1) {
      this.state.grid[Xcell][Ycell] = 0;
      this.state.out.lives--;
    } else {
      this.state.grid[Xcell][Ycell] = 1;
      this.state.out.lives++;
    }
    this.setState = ({ grid: this.state.grid });
    this.forceUpdate();
  }
  render() {
    return (
      <div className="life">
        <div className="title">
          <span>Game of Life</span>
        </div>
        <hr />
        <Controls
          ct={this.state.ct}
          clickControl={this.clickControl}
        />
        <Grid
          status={this.state}
          clickCell={this.clickCell}
        />
        <Output
          out={this.state.out}
        />
        <hr />
      </div>
    );
  }
}