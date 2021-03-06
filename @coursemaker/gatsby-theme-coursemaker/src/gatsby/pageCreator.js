const slugify = require(`slugify`);
// These templates are simply data-fetching wrappers that import components
const courseTemplate = require.resolve(
  `../../src/templates/course-landing-page-template.js`
);
const curriculumTemplate = require.resolve(
  "../../src/templates/course-curriculum-page-template.js"
);
const paymentTemplate = require.resolve(
  "../../src/templates/course-payment-page-template.js"
);
const lectureTemplate = require.resolve(
  "../../src/templates/lecture-page-template.js"
);
const schoolLandingTemplate = require.resolve(
  "../../src/templates/school-landing-page-template.js"
);
const schoolLoginTemplate = require.resolve(
  "../../src/templates/school-login-page-template.js"
);
const schoolRegistrationTemplate = require.resolve(
  "../../src/templates/school-registration-page-template.js"
);

const createSchool = (school, courses, createPage) => {
  // create the school landing page
  createPage({
    path: "/",
    component: schoolLandingTemplate,
    context: {
      school: school,
      courses: courses,
    },
  });

  // create the school login
  createPage({
    path: "/login",
    component: schoolLoginTemplate,
    context: {
      school: school,
      courses: courses,
    },
  });

  // create the school sign-up
  createPage({
    path: "/register",
    component: schoolRegistrationTemplate,
    context: {
      school: school,
      courses: courses,
    },
  });
};

const createCourses = (school, courses, createPage) => {
  courses.forEach((course /*i*/) => {
    // Individual course landing pages
    let slug = course.slug
      ? course.slug
      : `/${slugify(course.title, { strict: true, lower: true })}/`;
    course.slug = slug;
    // const nextCourse = i === courses.length - 1 ? null : courses[i + 1];
    // const previousCourse = i === 0 ? null : courses[i - 1];
    createPage({
      path: "/courses" + slug,
      component: courseTemplate,
      context: {
        course: course,
        school: school
      },
    });

    // Payment pages
    createPage({
      path: `/courses${slug}checkout`,
      component: paymentTemplate,
      context: {
        course: course,
        school: school,
      },
    });

    // Curriculum pages
    createPage({
      path: `/courses${slug}curriculum`,
      component: curriculumTemplate,
      context: {
        course: course,
        school: school,
      },
    });

    // Individual lectures pages
    allCourseLectures = [];
    if (course.sections) {
      course.sections.forEach((section) => {
        allCourseLectures = allCourseLectures.concat(section.lectures);
      });
    }

    allCourseLectures.forEach((lecture) => {
      createPage({
        path: `/courses${slug}lectures/${lecture.id}`,
        component: lectureTemplate,
        context: {
          course: course,
          lecture: lecture,
          allLectures: allCourseLectures,
          school: school,
        },
      });
    });
  });
};

module.exports = { createSchool, createCourses };
