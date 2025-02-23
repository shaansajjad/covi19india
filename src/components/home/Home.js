import Table from "./Table";
import "./Home.css";
import MapExplorer from "./Map";
import TimeSeriesExplorer from "./Timeseriesexplorer";
import Search from "./Search";
import Minigraph from "./Minigraph";
import { STATE_CODES_REVERSE, MAP_META } from "../../Constants";
import {
  formatDate,
  formatDateAbsolute,
  mergeTimeseries,
  preprocessTimeseries,
  parseStateTimeseries,
  parseStateTestTimeseries,
  parseTotalTestTimeseries,
  parseDistrictZones,
} from "../utils/Commonfunctions";
import Level from "./Level";
import axios from "axios";
import React, { useState, useCallback, useMemo } from "react";
import * as Icon from "react-feather";
import { useEffectOnce, useLocalStorage } from "react-use";

function Home(props) {
  const [states, setStates] = useState(null);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState(null);
  const [districtZones, setDistrictZones] = useState(null);
  const [stateTestData, setStateTestData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [timeseries, setTimeseries] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);
  const [showUpdates, setShowUpdates] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [mapOption, setMapOption] = useState("confirmed");
  const [isIntersecting, setIsIntersecting] = useState(false);

  const [lastViewedLog, setLastViewedLog] = useLocalStorage(
    "lastViewedLog",
    null
  );
  const [newUpdate, setNewUpdate] = useLocalStorage("newUpdate", false);

  const Bell = useMemo(
    () => (
      <Icon.Bell
        onClick={() => {
          setShowUpdates(!showUpdates);
          setNewUpdate(false);
        }}
      />
    ),
    [setNewUpdate, showUpdates]
  );

  const BellOff = useMemo(
    () => (
      <Icon.BellOff
        onClick={() => {
          setShowUpdates(!showUpdates);
        }}
      />
    ),
    [showUpdates]
  );

  useEffectOnce(() => {
    getStates();
  });

  useEffectOnce(() => {
    axios
      .get("https://api.covid19india.org/updatelog/log.json")
      .then((response) => {
        const lastTimestamp = response.data
          .slice()
          .reverse()[0]
          .timestamp.toString();
        if (lastTimestamp !== lastViewedLog) {
          setNewUpdate(true);
          setLastViewedLog(lastTimestamp);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const getStates = async () => {
    try {
      const [
        { data: statesDailyResponse },
        { data: zonesResponse },
      ] = await Promise.all([
        axios.get("https://api.covid19india.org/states_daily.json"),
        axios.get("https://api.covid19india.org/zones.json"),
      ]);

      const [
        { data },
        { data: stateDistrictWiseResponse },
        { data: stateTestData },
      ] = await Promise.all([
        axios.get("https://api.covid19india.org/data.json"),
        axios.get("https://api.covid19india.org/state_district_wise.json"),
        axios.get("https://api.covid19india.org/state_test_data.json"),
      ]);

      setStates(data.statewise);
      setDistrictZones(parseDistrictZones(zonesResponse.zones));

      const ts = parseStateTimeseries(statesDailyResponse);
      ts["TT"] = preprocessTimeseries(data.cases_time_series);
      const testTs = parseStateTestTimeseries(stateTestData.states_tested_data);
      testTs["TT"] = parseTotalTestTimeseries(data.tested);
      const tsMerged = mergeTimeseries(ts, testTs);
      setTimeseries(tsMerged);

      setLastUpdated(data.statewise[0].lastupdatedtime);

      const testData = [...stateTestData.states_tested_data].reverse();
      const totalTest = data.tested[data.tested.length - 1];
      testData.push({
        updatedon: totalTest.updatetimestamp.split(" ")[0],
        totaltested: totalTest.totalsamplestested,
        source: totalTest.source,
        state: "Total",
      });
      setStateTestData(testData);

      setStateDistrictWiseData(stateDistrictWiseResponse);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = useCallback((state) => {
    if (!state) return setRegionHighlighted(null);
    state.code = STATE_CODES_REVERSE[state.state];
    setRegionHighlighted({ state });
  }, []);

  const onHighlightDistrict = useCallback((district, state) => {
    if (!state && !district) return setRegionHighlighted(null);
    setRegionHighlighted({ district, state });
  }, []);

  const handleIntersection = ({ isIntersecting }) => {
    setIsIntersecting(isIntersecting);
  };

  const options = {
    rootMargin: "0px 0px 0px 0px",
  };

  return (
    <React.Fragment>
      <div className="Home">
        <div className="home-left">
          <Search />
          <div className="actions">
            <h5>
              {isNaN(Date.parse(formatDate(lastUpdated)))
                ? ""
                : formatDateAbsolute(lastUpdated)}
            </h5>
            {!showUpdates && (
              <div className="bell-icon">
                {fetched && Bell}
                {newUpdate && <div className="indicator"></div>}
              </div>
            )}
            {fetched && showUpdates && BellOff}
          </div>

          {states && <Level data={states[0]} />}
          <Minigraph />

          {stateDistrictWiseData && (
            <Table
              states={states}
              summary={false}
              districts={stateDistrictWiseData}
              zones={districtZones}
              regionHighlighted={regionHighlighted}
              onHighlightState={onHighlightState}
              onHighlightDistrict={onHighlightDistrict}
            />
          )}
        </div>
        <div className="home-right">
          <React.Fragment>
            {fetched && (
              <MapExplorer
                mapMeta={MAP_META.India}
                states={states}
                districts={stateDistrictWiseData}
                stateTestData={stateTestData}
                regionHighlighted={regionHighlighted}
                isCountryLoaded={true}
                anchor={anchor}
                setAnchor={setAnchor}
                mapOption={mapOption}
                setMapOption={setMapOption}
              />
            )}
            {timeseries && (
              <TimeSeriesExplorer
                timeseries={timeseries[regionHighlighted?.state.code || "TT"]}
                activeStateCode={regionHighlighted?.state.code || "TT"}
                onHighlightState={onHighlightState}
                states={states}
                anchor={anchor}
                setAnchor={setAnchor}
              />
            )}
          </React.Fragment>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Home;
