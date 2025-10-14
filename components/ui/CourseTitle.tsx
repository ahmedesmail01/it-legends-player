import React from "react";

type Props = {
  title: string;
};

const CourseTitle = ({ title }: Props) => {
  return <h1 className="text-3xl font-bold mt-2">{title}</h1>;
};

export default CourseTitle;
