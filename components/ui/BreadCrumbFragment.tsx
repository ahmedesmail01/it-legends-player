import { Breadcrumb } from "antd";
import React from "react";

const BreadCrumbFragment = () => {
  return (
    <div>
      <Breadcrumb
        className="font-semibold"
        separator=">"
        items={[
          {
            title: "Home",
          },
          {
            title: "Course",
            // href: "",
          },
          {
            title: "Course Details",
          },
        ]}
      />
    </div>
  );
};

export default BreadCrumbFragment;
