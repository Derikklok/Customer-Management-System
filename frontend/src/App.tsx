import { Route, Routes } from "react-router-dom";

import { ConfigProvider, App as AntdApp } from "antd";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateCustomerPage from "./pages/dashboard/CreateCustomerPage";
import EditCustomerPage from "./pages/dashboard/EditCustomerPage";
import ViewCustomerPage from "./pages/dashboard/ViewCustomerPage";
import BulkUpdatePage from "./pages/dashboard/BulkUpdatePage";


const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          fontFamily: "Inter, sans-serif",
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-customer" element={<CreateCustomerPage/>} />
          <Route path="/edit-customer/:id" element={<EditCustomerPage/>}/>
          <Route path="/view-customer/:id" element={<ViewCustomerPage/>}/>
          <Route path="/bulk-create" element={<BulkUpdatePage/>}/>

        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
