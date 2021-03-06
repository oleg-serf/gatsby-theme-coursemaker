import React, { useEffect } from "react";
import { Link } from "gatsby";
import Markdown from "../helpers/StrapiMarkdown/Markdown";
import { MDXRenderer } from "gatsby-plugin-mdx";
import _ from "lodash";
import { navigate } from "gatsby";
import "katex/dist/katex.min.css";

import LayoutLecture from "../components/layout-lecture";
import Breadcrumbs from "../components/course-breadcrumbs";
import Video from "../components/video";
import { isAuthorized } from "../auth/auth";
import { bakeLocalStorage, readLocalStorage } from "../helpers/storage";

const Lecture = ({ pageContext = {} }) => {
  useEffect(() => {
    if (!isAuthorized(pageContext.course.id))
      navigate(`/courses${pageContext.course.slug}checkout`);
  });
  const currentCourse = pageContext.course;
  const lecture = pageContext.lecture;

  let allLectures;
  if (
    currentCourse == null ||
    currentCourse?.sections === undefined ||
    currentCourse?.sections.length == 0
  ) {
    allLectures = [];
  } else {
    allLectures = currentCourse?.sections
      ?.map((section) =>
        _.orderBy(
          section?.lectures,
          section?.lectures?.[0].hasOwnProperty("order") ? "order" : "id",
          "asc"
        ).map((item) => item)
      )
      .flat(1);
  }

  let nextLecture;
  let prevLecture;

  allLectures.forEach((item, i) => {
    if (item.id === lecture.id) {
      if (i <= allLectures.length - 1) nextLecture = allLectures[i + 1];
      if (i > 0) prevLecture = allLectures[i - 1];
      if (i === 0) prevLecture = false;
      if (i === allLectures.length - 1) nextLecture = false;
    }
  });
  let lecture_body;
  if (lecture.body)
    // local source
    lecture_body = <MDXRenderer>{lecture.body}</MDXRenderer>;
  // strapi
  else
    lecture_body = (
      <Markdown source={lecture.body_markdown} />
      // <Markdown source="Given a **formula** below\n$$\ns = ut + \\frac{1}{2}at^{2}\n$$\nCalculate the value of $s$ when $u = 10\\frac{m}{s}$ and $a = 2\\frac{m}{s^{2}}$ at $t = 1s$" />
    );

  const addLectureToComplete = async (lecture) => {
    let state = readLocalStorage(currentCourse.slug);
    let newState = {
      items: [...((state && state?.items) || [])],
    };

    const exists = newState?.items?.some((item) => item?.id === lecture?.id);

    if (exists)
      newState.items = newState?.items.map((item) =>
        item?.id === lecture?.id ? { ...item } : item
      );
    else newState.items = [...newState.items, { id: lecture?.id }];

    bakeLocalStorage(currentCourse.slug, newState);
  };

  return (
    <LayoutLecture
      pageContext={pageContext}
      lecture={lecture}
      lectureList={allLectures}
      totalLectures={allLectures.length}
      currentCourse={currentCourse}
    >
      {/* video */}
      {<Video videoID={lecture?.video_id} />}

      {/* course header */}
      <div className="pt-5 border-b border-gray-300">
        <div className="container lg:max-w-full">
          {
            <Breadcrumbs
              school={pageContext.school}
              course={currentCourse}
              lecture={lecture}
            />
          }
          <div className="items-end justify-between pt-4 pb-6 lg:flex">
            <div>
              <h2 className="leading-tight">{lecture.title}</h2>
            </div>

            {/* .controls */}
            <div className="flex mt-5 controls space-x-6 lg:mt-0">
              {prevLecture && (
                <Link to={`../${prevLecture.id}`} className="btn btn-gray">
                  Previous
                </Link>
              )}
              {nextLecture && (
                <Link
                  onClick={async () => {
                    await addLectureToComplete(nextLecture);
                  }}
                  to={`../${nextLecture.id}`}
                  className="btn btn-default"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* course content */}
      <div className="w-full py-12 mx-auto lg:py-16 lg:w-9/12">
        <div className="container">
          <div className="font-light leading-relaxed text-gray-700 description space-y-4 lg:w-11/12">
            {lecture_body}
          </div>
        </div>
      </div>
    </LayoutLecture>
  );
};

export default Lecture;
