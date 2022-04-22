import React, { Component } from "react";
import { translate } from "react-polyglot";
import { HashRouter as Router, Switch, Link, Route } from "react-router-dom";
import "./App.css";
import eth from "./web3";
import Main from "./Main";
import Dai from "./Dai";
import daiLogo from "./dai-pixel.png";

const ethers = require("ethers");
const utils = ethers.utils;

const jsonFetch = (url) => fetch(url).then((res) => res.json());

const add = require("./addresses.json");
add["CHIEF"] = "0x4796dC3110bc1db8064910485b6c21451ff8f285";
add["MULTICALL"] = "0x3B267bB45CCB28e2389e76b03507A39fbb5114b5";

const reverseAddresses = Object.entries(add).reduce(
  (add, [key, value]) => ((add[value] = key), add),
  {}
);

const build = (address, name) => {
  return new ethers.Contract(address, require(`./abi/${name}.json`), eth);
};

const multi = build(add.MULTICALL, "Multicall");
const ilkRegistry = build(add.ILK_REGISTRY, "IlkRegistry");
const vat = build(add.MCD_VAT, "Vat");
const pot = build(add.MCD_POT, "Pot");
const jug = build(add.MCD_JUG, "Jug");
const vow = build(add.MCD_VOW, "Vow");
const cat = build(add.MCD_CAT, "Cat");
const dog = build(add.MCD_DOG, "Dog");
const spot = build(add.MCD_SPOT, "Spotter");
const autoline = build(add.MCD_IAM_AUTO_LINE, "DssAutoLine");
const flash = build(add.MCD_FLASH, "DssFlash");
const pause = build(add.MCD_PAUSE, "DSPause");
const chief = build(add.CHIEF, "DSChief");
const esm = build(add.MCD_ESM, "ESM");
const end = build(add.MCD_END, "End");
const vestDai = build(add.MCD_VEST_DAI, "DssVestSuckable");
const vestMkrTreasury = build(
  add.MCD_VEST_MKR_TREASURY,
  "DssVestTransferrable"
);
const wxdc = build(add.XDC, "ERC20");
const dai = build(add.MCD_DAI, "Dai");
const mkr = build(add.MCD_GOV, "DSToken");
const manager = build(add.CDP_MANAGER, "DssCdpManager");
const clip = build(add.MCD_CLIP_ETH_A, "Clipper"); // FIXME are these all the same now?
// NOTE one calc instance is shared between all ilks though each ilk has its own calc contract
const calc = build(add.MCD_CLIP_CALC_ETH_A, "StairstepExponentialDecrease");
const flap = build(add.MCD_FLAP, "Flapper");
const flop = build(add.MCD_FLOP, "Flopper");
const pip = build(add.PIP_ETH, "OSM");
const xdcAIlkBytes = utils.formatBytes32String("XDC-A");
const xdcBIlkBytes = utils.formatBytes32String("XDC-B");
const xdcCIlkBytes = utils.formatBytes32String("XDC-C");
window.utils = utils;
window.add = add;
window.vat = vat;
window.vow = vow;
window.cat = cat;
window.mkr = mkr;
window.pot = pot;
window.jug = jug;
window.multi = multi;
window.dai = dai;

const RAY = ethers.BigNumber.from("1000000000000000000000000000");
const WAD = ethers.BigNumber.from("1000000000000000000");
const DP2 = ethers.BigNumber.from("10000000000000000");
const DP6 = ethers.BigNumber.from("1000000000000");
const DP7 = ethers.BigNumber.from("1000000000000");
const DP8 = ethers.BigNumber.from("10000000000");
const DP10 = ethers.BigNumber.from("1000000000");
const DP18 = ethers.BigNumber.from("1");

const HOP = 3600; // assumes all OSM's have same hop

const VEST_DAI_IDS = 0;
const VEST_MKR_TREASURY_IDS = 0;

class App extends Component {
  state = {
    blockNumber: null,
    paused: false,
  };

  POSITION_NXT = 4;
  POSITION_MEDIAN_VAL = 2;

  componentDidMount() {
    this.all("latest");
  }

  componentWillUnmount() {
    eth.removeAllListeners();
  }

  togglePause = () => {
    if (this.state.paused) {
      eth.on("block", (blockNumber) => {
        this.all(blockNumber);
      });
    } else {
      eth.removeAllListeners();
    }
    this.setState({
      paused: !this.state.paused,
    });
  };

  all = async (blockNumber) => {
    let p1 = multi.callStatic.aggregate(
      [
        [
          add.MULTICALL,
          multi.interface.encodeFunctionData("getCurrentBlockTimestamp", []),
        ],
        [add.MCD_VAT, vat.interface.encodeFunctionData("Line", [])],
        [add.MCD_VAT, vat.interface.encodeFunctionData("debt", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("hump", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("sump", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("Sin", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("Ash", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("bump", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("dump", [])],
        [add.MCD_VOW, vow.interface.encodeFunctionData("wait", [])],
        [add.MCD_VAT, vat.interface.encodeFunctionData("dai", [add.MCD_VOW])],
        [add.MCD_VAT, vat.interface.encodeFunctionData("sin", [add.MCD_VOW])],
        [add.MCD_DAI, dai.interface.encodeFunctionData("totalSupply", [])],

        [add.MCD_POT, pot.interface.encodeFunctionData("Pie", [])],
        [add.MCD_POT, pot.interface.encodeFunctionData("chi", [])],
        [add.MCD_POT, pot.interface.encodeFunctionData("rho", [])],
        [add.CDP_MANAGER, manager.interface.encodeFunctionData("cdpi", [])],
        [add.MCD_JUG, jug.interface.encodeFunctionData("base", [])],

        [add.MCD_POT, pot.interface.encodeFunctionData("dsr", [])],
        [add.MCD_GOV, mkr.interface.encodeFunctionData("totalSupply", [])],
        [add.MCD_VAT, vat.interface.encodeFunctionData("vice", [])],

        [add.MCD_FLAP, flap.interface.encodeFunctionData("beg", [])],
        [add.MCD_FLAP, flap.interface.encodeFunctionData("ttl", [])],
        [add.MCD_FLAP, flap.interface.encodeFunctionData("tau", [])],
        [add.MCD_FLAP, flap.interface.encodeFunctionData("kicks", [])],
        [add.MCD_FLOP, flop.interface.encodeFunctionData("beg", [])],
        [add.MCD_FLOP, flop.interface.encodeFunctionData("pad", [])],
        [add.MCD_FLOP, flop.interface.encodeFunctionData("ttl", [])],
        [add.MCD_FLOP, flop.interface.encodeFunctionData("tau", [])],
        [add.MCD_FLOP, flop.interface.encodeFunctionData("kicks", [])],

        [
          add.MCD_GOV,
          mkr.interface.encodeFunctionData("balanceOf", [add.MCD_PAUSE_PROXY]),
        ],
        [add.MCD_DOG, dog.interface.encodeFunctionData("Hole", [])],
        [add.MCD_DOG, dog.interface.encodeFunctionData("Dirt", [])],

        [add.MCD_FLASH, flash.interface.encodeFunctionData("max", [])],
        [add.MCD_FLASH, flash.interface.encodeFunctionData("toll", [])],
        [add.MCD_PAUSE, pause.interface.encodeFunctionData("delay", [])],
        [add.CHIEF, chief.interface.encodeFunctionData("hat", [])],
        [add.MCD_ESM, esm.interface.encodeFunctionData("min", [])],
        [add.MCD_ESM, esm.interface.encodeFunctionData("Sum", [])],
        [add.MCD_END, end.interface.encodeFunctionData("wait", [])],
      ]
        .concat(this.getVestingCalls(add.MCD_VEST_DAI, vestDai, VEST_DAI_IDS))
        .concat(
          this.getVestingCalls(
            add.MCD_VEST_MKR_TREASURY,
            vestMkrTreasury,
            VEST_MKR_TREASURY_IDS
          )
        )
        .concat(
          this.getIlkCall(xdcAIlkBytes, "XDC_A", wxdc, add.XDC, add.PIP_XDC)
        )
        .concat(
          this.getIlkCall(xdcBIlkBytes, "XDC_B", wxdc, add.XDC, add.PIP_XDC)
        )
        .concat(
          this.getIlkCall(xdcCIlkBytes, "XDC_C", wxdc, add.XDC, add.PIP_XDC)
        ),

      { blockTag: blockNumber }
    );
    let promises = [
      p1,
      this.getXdcSupply(),
      this.getPrice(add.PIP_XDC, this.POSITION_NXT),
      this.getPrice(add.VAL_XDC, this.POSITION_MEDIAN_VAL),
    ];

    let [[block, res], xdcSupply, xdcPriceNxt, xdcPriceMedian] =
      await Promise.all(promises);

    var offset = 0;

    const timestamp = multi.interface.decodeFunctionResult(
      "getCurrentBlockTimestamp",
      res[offset++]
    );
    const line = res[offset++]; // vat.interface.decodeFunctionResult('Line', res[0])
    const debt = res[offset++]; //vat.interface.decodeFunctionResult('debt', res[1])
    const surplusBuffer = vow.interface.decodeFunctionResult(
      "hump",
      res[offset++]
    )[0];
    const debtSize = vow.interface.decodeFunctionResult(
      "sump",
      res[offset++]
    )[0];
    const sin = vow.interface.decodeFunctionResult("Sin", res[offset++])[0];
    const ash = vow.interface.decodeFunctionResult("Ash", res[offset++])[0];
    const surplusBump = vow.interface.decodeFunctionResult(
      "bump",
      res[offset++]
    )[0];
    const debtDump = vow.interface.decodeFunctionResult(
      "dump",
      res[offset++]
    )[0];
    const vowWait = vow.interface.decodeFunctionResult(
      "wait",
      res[offset++]
    )[0];
    const vow_dai = vat.interface.decodeFunctionResult("dai", res[offset++])[0];
    const vow_sin = vat.interface.decodeFunctionResult("sin", res[offset++])[0];
    const daiSupply = dai.interface.decodeFunctionResult(
      "totalSupply",
      res[offset++]
    )[0];

    const savingsPie = pot.interface.decodeFunctionResult(
      "Pie",
      res[offset++]
    )[0];
    const pieChi = pot.interface.decodeFunctionResult("chi", res[offset++])[0];
    const savingsDai = savingsPie.mul(pieChi);
    const potDrip = pot.interface.decodeFunctionResult("rho", res[offset++])[0];
    const cdps = manager.interface.decodeFunctionResult("cdpi", res[offset++]);
    // hack cast to bignumber for "jug.base = 0"
    const base =
      "0x" + jug.interface.decodeFunctionResult("base", res[offset++]);

    const dsr = pot.interface.decodeFunctionResult("dsr", res[offset++])[0];
    const mkrSupply = mkr.interface.decodeFunctionResult(
      "totalSupply",
      res[offset++]
    )[0];
    const vice = vat.interface.decodeFunctionResult("vice", res[offset++])[0];

    const flapBeg = flap.interface.decodeFunctionResult(
      "beg",
      res[offset++]
    )[0];
    const flapTtl = flap.interface.decodeFunctionResult("ttl", res[offset++]);
    const flapTau = flap.interface.decodeFunctionResult("tau", res[offset++]);
    const flapKicks = flap.interface.decodeFunctionResult(
      "kicks",
      res[offset++]
    )[0];
    const flopBeg = flop.interface.decodeFunctionResult(
      "beg",
      res[offset++]
    )[0];
    const flopPad = flop.interface.decodeFunctionResult(
      "pad",
      res[offset++]
    )[0];
    const flopTtl = flop.interface.decodeFunctionResult("ttl", res[offset++]);
    const flopTau = flop.interface.decodeFunctionResult("tau", res[offset++]);
    const flopKicks = flop.interface.decodeFunctionResult(
      "kicks",
      res[offset++]
    )[0];

    const protocolTreasury = mkr.interface.decodeFunctionResult(
      "balanceOf",
      res[offset++]
    )[0];
    const hole = dog.interface.decodeFunctionResult("Hole", res[offset++])[0];
    const dirt = dog.interface.decodeFunctionResult("Dirt", res[offset++])[0];

    const flashLine = flash.interface.decodeFunctionResult(
      "max",
      res[offset++]
    )[0];
    const flashToll = flash.interface.decodeFunctionResult(
      "toll",
      res[offset++]
    )[0];
    const pauseDelay = pause.interface.decodeFunctionResult(
      "delay",
      res[offset++]
    )[0];
    const hat = chief.interface.decodeFunctionResult("hat", res[offset++]);
    const esmMin = esm.interface.decodeFunctionResult("min", res[offset++])[0];
    const esmSum = esm.interface.decodeFunctionResult("Sum", res[offset++])[0];
    const endWait = end.interface.decodeFunctionResult(
      "wait",
      res[offset++]
    )[0];

    const ILK_CALL_COUNT = 17;
    const VEST_CALL_COUNT = 3;

    const vestingDai = this.getVestingMaps(res, offset, vestDai, VEST_DAI_IDS);
    const vestingMkrTreasury = this.getVestingMaps(
      res,
      (offset += VEST_DAI_IDS * VEST_CALL_COUNT),
      vestMkrTreasury,
      VEST_MKR_TREASURY_IDS
    );

    const ilks = [
      this.getIlkMap(
        res,
        (offset += VEST_MKR_TREASURY_IDS * VEST_CALL_COUNT),
        "XDC",
        "XDC-A",
        wxdc,
        18,
        base,
        xdcPriceNxt,
        xdcPriceMedian,
        DP10
      ),
      this.getIlkMap(
        res,
        (offset += ILK_CALL_COUNT),
        "XDC",
        "XDC-B",
        wxdc,
        18,
        base,
        xdcPriceNxt,
        xdcPriceMedian,
        DP10
      ),
      this.getIlkMap(
        res,
        (offset += ILK_CALL_COUNT),
        "XDC",
        "XDC-C",
        wxdc,
        18,
        base,
        xdcPriceNxt,
        xdcPriceMedian,
        DP10
      ),
    ];

    const ilksByName = ilks.reduce((a, x) => ({ ...a, [x.ilk]: x }), {});
    const sysLocked = ilks.reduce(
      (t, i) => t.add(i.valueBn),
      ethers.BigNumber.from("0")
    );

    this.setState((state) => {
      return {
        blockNumber: block.toString(),
        timestamp: this.unixToDateTime(timestamp),
        timestampHHMM: this.unixToTime(timestamp),
        Line: utils.formatUnits(line, 45),
        debt: utils.formatUnits(debt, 45),
        ilks: ilks,
        ilksByName: ilksByName,
        vestingDai: vestingDai,
        vestingMkrTreasury: vestingMkrTreasury,
        daiSupply: utils.formatEther(daiSupply),
        xdcSupply: utils.formatEther(xdcSupply),
        sysSurplus: utils.formatUnits(vow_dai.sub(vow_sin), 45),
        sysDebt: utils.formatUnits(vow_sin.sub(sin).sub(ash), 45),
        sysDebtRaw: vow_sin.sub(sin).sub(ash).toString(),
        vowDaiRaw: vow_dai.toString(),
        surplusBuffer: utils.formatUnits(surplusBuffer, 45),
        surplusBump: utils.formatUnits(surplusBump, 45),
        debtDump: utils.formatEther(debtDump),
        debtSize: utils.formatUnits(debtSize, 45),
        potFee: this.calcFee(dsr),
        savingsPie: utils.formatEther(savingsPie),
        savingsDai: utils.formatUnits(savingsDai, 45),
        potDrip: this.unixToDateTime(potDrip.toNumber()),
        hole: utils.formatUnits(hole, 45),
        dirt: utils.formatUnits(dirt, 45),
        flapBeg: utils.formatUnits(flapBeg, 18),
        flapTtl: flapTtl,
        flapTau: flapTau,
        flapKicks: flapKicks.toNumber(),
        flopBeg: utils.formatUnits(flopBeg, 18),
        flopPad: utils.formatUnits(flopPad, 18),
        flopTtl: flopTtl,
        flopTau: flopTau,
        flopKicks: flopKicks.toNumber(),
        flopDelay: vowWait.toNumber(),
        cdps: cdps.toString(),
        sysLocked: utils.formatUnits(sysLocked, 45),
        mkrSupply: utils.formatEther(mkrSupply),
        vice: utils.formatUnits(vice, 45),
        vow_dai: utils.formatUnits(vow_dai, 45),
        vow_sin: utils.formatUnits(vow_sin, 45),
        bigSin: utils.formatUnits(sin, 45),
        protocolTreasury: utils.formatEther(protocolTreasury),
        flashLine: utils.formatEther(flashLine),
        flashToll: utils.formatEther(flashToll),
        pauseDelay: pauseDelay.toNumber(),
        hat: hat,
        esmMin: utils.formatEther(esmMin),
        esmSum: utils.formatEther(esmSum),
        endWait: endWait.toNumber(),
      };
    });
  };

  getIlkCall = (ilkBytes, ilkSuffix, gem, gemAdd, pipAdd) => {
    var pipCall, lockedCall;
    const gemJoinAdd = add["MCD_JOIN_" + ilkSuffix];
    const clipAdd = add["MCD_CLIP_" + ilkSuffix];
    const calcAdd = add["MCD_CLIP_CALC_" + ilkSuffix];
    pipCall = [pipAdd, pip.interface.encodeFunctionData("zzz", [])];

    lockedCall = [
      gemAdd,
      gem.interface.encodeFunctionData("balanceOf", [gemJoinAdd]),
    ];

    return [
      [add.MCD_VAT, vat.interface.encodeFunctionData("ilks", [ilkBytes])],
      [add.MCD_JUG, jug.interface.encodeFunctionData("ilks", [ilkBytes])],
      [add.MCD_SPOT, spot.interface.encodeFunctionData("ilks", [ilkBytes])],
      // FIXME only include autoline when needed?
      [
        add.MCD_IAM_AUTO_LINE,
        autoline.interface.encodeFunctionData("ilks", [ilkBytes]),
      ],
      [add.MCD_DOG, dog.interface.encodeFunctionData("ilks", [ilkBytes])], // 5
      lockedCall,
      [gemAdd, gem.interface.encodeFunctionData("totalSupply", [])],
      pipCall,
      [clipAdd, clip.interface.encodeFunctionData("buf", [])],
      [clipAdd, clip.interface.encodeFunctionData("tail", [])], // 10
      [clipAdd, clip.interface.encodeFunctionData("cusp", [])],
      [clipAdd, clip.interface.encodeFunctionData("chip", [])],
      [clipAdd, clip.interface.encodeFunctionData("tip", [])],
      [clipAdd, clip.interface.encodeFunctionData("count", [])],
      [clipAdd, clip.interface.encodeFunctionData("kicks", [])],
      [calcAdd, calc.interface.encodeFunctionData("cut", [])], // 15
      [calcAdd, calc.interface.encodeFunctionData("step", [])],
    ];
  };

  getIlkMap = (
    res,
    idx,
    token,
    ilkName,
    gem,
    units,
    base,
    priceNxt = null,
    priceMedian = null,
    medianDp = null,
    tokenDp = null
  ) => {
    var locked, zzz, price, value, valueBn;
    // variations no autoline USDT
    const ilk = vat.interface.decodeFunctionResult("ilks", res[idx++]);
    const jugIlk = jug.interface.decodeFunctionResult("ilks", res[idx++]);
    const spotIlk = spot.interface.decodeFunctionResult("ilks", res[idx++]);
    const autoLineIlk = autoline.interface.decodeFunctionResult(
      "ilks",
      res[idx++]
    );
    const dogIlk = dog.interface.decodeFunctionResult("ilks", res[idx++]);
    locked = gem.interface.decodeFunctionResult("balanceOf", res[idx++])[0];
    const supply = gem.interface.decodeFunctionResult(
      "totalSupply",
      res[idx++]
    )[0];

    if (["USDC", "TUSD", "USDP", "GUSD", "ADAI"].includes(token)) {
      zzz = null;
      //price = pip.interface.decodeFunctionResult('read', res[idx++])[0]
      // FIXME read fails for TUSD
      idx++;
      // FIXME hardwired price to 1
      price = ethers.BigNumber.from(1).mul(DP10);
      if (tokenDp) {
        value = locked.mul(tokenDp).mul(price);
      } else {
        value = locked.mul(price);
      }
      price = RAY;
      valueBn = value.mul(WAD);
      value = utils.formatUnits(value, 27);
    } else {
      zzz = pip.interface.decodeFunctionResult("zzz", res[idx++]);
      price = spotIlk.mat.mul(ilk.spot).div(RAY);

      if (tokenDp) {
        value = locked.mul(tokenDp).mul(priceMedian.mul(medianDp));
      } else if (medianDp) {
        value = locked.mul(priceMedian.mul(medianDp));
      } else {
        value = locked.mul(priceMedian || price);
      }
      valueBn = value;
      value = utils.formatUnits(value, 45);
    }

    const r = {
      token: token,
      ilk: ilkName,
      Art: utils.formatEther(ilk.Art),
      rate: utils.formatUnits(ilk.rate, 27),
      spot: utils.formatUnits(ilk.spot, 27),
      mat: utils.formatUnits(spotIlk.mat, 27),
      line: utils.formatUnits(ilk.line, 45),
      dust: utils.formatUnits(ilk.dust, 45),
      lineMax: utils.formatUnits(autoLineIlk.line, 45),
      gap: utils.formatUnits(autoLineIlk.gap, 45),
      ttl: autoLineIlk.ttl,
      lastInc: this.unixToDateTime(autoLineIlk.lastInc),
      chop: utils.formatUnits(dogIlk.chop, 18),
      hole: utils.formatUnits(dogIlk.hole, 45),
      dirt: utils.formatUnits(dogIlk.dirt, 45),
      buf: utils.formatUnits(
        clip.interface.decodeFunctionResult("buf", res[idx++])[0],
        27
      ),
      tail: clip.interface.decodeFunctionResult("tail", res[idx++])[0],
      cusp: utils.formatUnits(
        clip.interface.decodeFunctionResult("cusp", res[idx++])[0],
        27
      ),
      chip: utils.formatUnits(
        clip.interface.decodeFunctionResult("chip", res[idx++])[0],
        18
      ),
      tip: utils.formatUnits(
        clip.interface.decodeFunctionResult("tip", res[idx++])[0],
        45
      ),
      count: clip.interface.decodeFunctionResult("count", res[idx++])[0],
      kicks: clip.interface
        .decodeFunctionResult("kicks", res[idx++])[0]
        .toNumber(),
      cut: utils.formatUnits(
        calc.interface.decodeFunctionResult("cut", res[idx++])[0],
        27
      ),
      step: calc.interface.decodeFunctionResult("step", res[idx++])[0],
      drip: this.unixToDateTime(jugIlk.rho.toNumber()),
      fee: this.getFee(base, jugIlk),
      locked: utils.formatUnits(locked, units),
      lockedBn: locked,
      supply: utils.formatUnits(supply, units),
      price: utils.formatUnits(price, 27),
      value: value,
      valueBn: valueBn,
    };
    if (zzz) {
      r.zzz = this.unixToTime(+zzz + HOP);
    }
    if (priceNxt) {
      r.priceNxt = utils.formatEther(priceNxt);
    }
    if (priceMedian) {
      r.priceMedian = utils.formatEther(priceMedian);
    }
    return r;
  };

  getVestingCalls = (address, vest, ids) => {
    var r = [];
    for (let i = 1; i <= ids; i++) {
      r.push([address, vest.interface.encodeFunctionData("awards", [i])]);
      r.push([address, vest.interface.encodeFunctionData("accrued", [i])]);
      r.push([address, vest.interface.encodeFunctionData("unpaid", [i])]);
    }
    return r;
  };

  getVestingMaps = (res, idx, vest, ids) => {
    // TODO show:
    //    address mgr;   // A manager address that can yank
    //    uint8   res;   // Restricted
    var r = [];
    for (let i = 0; i < ids; i++) {
      var award = vest.interface.decodeFunctionResult(
        "awards",
        res[idx + i * 3]
      );
      r.push({
        id: i + 1,
        usrName: reverseAddresses[award.usr],
        usr: award.usr,
        res: award.res,
        bgn: this.unixToDate(award.bgn),
        clf: this.unixToDate(award.clf),
        fin: this.unixToDate(award.fin),
        tot: utils.formatEther(award.tot),
        rxd: utils.formatEther(award.rxd),
        accrued: utils.formatEther(
          vest.interface.decodeFunctionResult(
            "accrued",
            res[idx + i * 3 + 1]
          )[0]
        ),
        unpaid: utils.formatEther(
          vest.interface.decodeFunctionResult("unpaid", res[idx + i * 3 + 2])[0]
        ),
      });
    }
    return r;
  };

  getLerp = (start, end, startTime, duration, timestamp) => {
    // from LerpFactory.sol:75
    // https://etherscan.io/address/0x0239311b645a8ef91dc899471497732a1085ba8b#code#L75
    if (timestamp.gte(startTime)) {
      if (timestamp.lt(startTime.add(duration))) {
        let t = timestamp.sub(startTime).mul(WAD).div(duration);
        return end.mul(t).div(WAD).add(start).sub(start.mul(t).div(WAD));
      } else {
        return ethers.BigNumber.from("0");
      }
    } else {
      return ethers.BigNumber.from("0");
    }
  };

  isLoaded = () => {
    return this.state.blockNumber !== null;
  };

  unixToDateTime = (stamp) =>
    this.unixToDate(stamp) + " " + this.unixToTime(stamp);
  unixToDate = (stamp) => {
    const d = new Date(stamp * 1000);
    return (
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2)
    );
  };
  unixToTime = (stamp) => new Date(stamp * 1000).toLocaleTimeString("en-US");

  calcFee = (rate) =>
    parseFloat(utils.formatUnits(rate, 27)) ** (60 * 60 * 24 * 365) * 1 - 1;

  getFee = (base, ilk) => {
    const { duty } = ilk;
    const combo = duty.add(base);
    return this.calcFee(combo);
  };

  getXdcSupply = async () => {
    return 0;
  };

  getPrice = async (osm, position) => {
    const val = await eth.getStorageAt(osm, position);
    return ethers.BigNumber.from("0x" + val.substring(34));
  };

  getMarketPrices = async () => {
    // const json = await jsonFetch('https://api.coingecko.com/api/v3/simple/price?ids=maker%2Cdai&vs_currencies=usd');
    const json = {};
    return json;
  };

  render() {
    const t = this.props.t;
    if (this.isLoaded()) {
      return (
        <Router basename="/">
          {/* <NavBar /> */}
          <div className="notification is-primary has-text-centered">
            {/* eslint-disable-next-line */}
            {t("daistats.block")}: <strong>{this.state.blockNumber}</strong>{" "}
            Time:{" "}
            <strong title={this.state.timestamp}>
              {this.state.timestampHHMM}
            </strong>
            .{" "}
            {this.state.paused
              ? `${t("daistats.pause")}.`
              : `${t("daistats.auto_updating")}.`}{" "}
            <a onClick={this.togglePause}>
              {this.state.paused ? t("daistats.restart") : t("daistats.pause")}
            </a>
            <br />
            <a
              href="https://twitter.com/nanexcool"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("daistats.say_hi")}
            </a>
            <br />
            <div className="buttons is-centered">
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("en")}
              >
                English
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("es")}
              >
                Español
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("fr")}
              >
                Français
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("it")}
              >
                Italiano
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("de")}
              >
                Deutsch
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("id")}
              >
                Bahasa Indonesia
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("zh-TW")}
              >
                繁體中文
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("jp")}
              >
                日本語
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("ru")}
              >
                Русский
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("ga")}
              >
                Gaeilge
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("tr")}
              >
                Türkçe
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("pl")}
              >
                Polski
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("ro")}
              >
                Română
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("fa")}
              >
                فارسی
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("uk")}
              >
                Українська
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("kr")}
              >
                한국어
              </button>
              <button
                className="button is-small is-rounded"
                onClick={() => this.props.toggle("af")}
              >
                Afrikaans
              </button>
              {/* <button className="button is-small is-rounded" onClick={() => this.props.toggle('dw')}>Daiwanese 🤪</button> */}
            </div>
          </div>
          <Switch>
            <Route path="/dai">
              <Dai {...this.state} {...add} />
            </Route>
            <Route path="/">
              <Main {...this.state} {...add} togglePause={this.togglePause} />
            </Route>
          </Switch>
        </Router>
      );
    } else {
      return (
        <section className="section">
          <div className="container has-text-centered">
            <figure className="image is-128x128 container">
              <img src={daiLogo} alt="Dai Logo" />
            </figure>
            <br />
            <progress className="progress is-small is-primary" max="100">
              15%
            </progress>
            <p>{t("daistats.one_sec")}</p>
          </div>
        </section>
      );
    }
  }
}

export default translate()(App);
