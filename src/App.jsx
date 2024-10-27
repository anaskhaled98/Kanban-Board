import { useEffect, useState } from "react";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import WorkSpcace from "./components/workSpace";
import { DataContext } from "./DataContext";

function App() {
  const [dataState, setDataState] = useState([]);
  const [selectBoardIndex, setSelectBoardIndex] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem("Data");
    if (savedData) setDataState(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    if (!dataState.length) return;
    localStorage.setItem("Data", JSON.stringify(dataState));
  }, [dataState]);

  return (
    <DataContext.Provider
      value={{
        data: dataState,
        setData: setDataState,
        selectBoardIndex: selectBoardIndex,
        setSelectBoardIndex: setSelectBoardIndex,
      }}
    >
      <div className="flex h-screen flex-col font-jakarta">
        <Header />
        <div className="flex flex-1">
          <SideMenu />
          <WorkSpcace />
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
