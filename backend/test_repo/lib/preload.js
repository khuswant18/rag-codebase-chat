
export const preloadCriticalRoutes = async (userRole) => {
  try {
    const preloadPromises = [];


    preloadPromises.push(import('../pages/Home.jsx'));

    switch (userRole) {
      case 'mentor':
        preloadPromises.push(
          import('../pages/Mentor/dashboard/Home.jsx'),
          import('../pages/MentorProfilePage.jsx'),
          import('../pages/Mentor/dashboard/Meetings.jsx'),
          import('../layouts/MentorDashboardLayout.jsx')
        );
        break;

      case 'user':

        preloadPromises.push(
          import('../pages/User/Home.jsx'),
          import('../pages/AllMentorsPage.jsx'),
          import('../layouts/UserDashboardLayout.jsx')
        );
        break;

      default:

        preloadPromises.push(
          import('../pages/AllMentorsPage.jsx'),
          import('../pages/CollegesPage.jsx'),
          import('../pages/Auth/LoginPage.jsx'),
          import('../pages/Auth/SignupPage.jsx')
        );
    }


    preloadPromises.push(
      import('../components/layout/Navbar.jsx'),
      import('../components/layout/Footer.jsx'),
      import('../components/ui/loader')
    );

    await Promise.all(preloadPromises);
    // console.log(`Preloaded critical routes for ${userRole} role`);
  } catch (error) {
    console.warn('Error preloading routes:', error);
  }
};


export const preloadHeavyLibraries = async (context) => {
  try {
    const libraryPromises = [];

    switch (context) {
      case 'video':

        libraryPromises.push(import('../components/ZegoVideoCall.jsx'));
        break;

      case 'charts':


        break;

      case 'animation':


        break;

      case 'ui':


        break;

      default:


    }

    if (libraryPromises.length > 0) {
      await Promise.all(libraryPromises);
      // console.log(`Preloaded libraries for ${context} context`);
    }
  } catch (error) {
    console.warn('Error preloading libraries:', error);
  }
};


export const preloadPredictedRoutes = async (predictedRoutes) => {
  try {
    const routePromises = predictedRoutes.map(route => {
      switch (route) {
        case 'mentors':
          return import('../pages/AllMentorsPage.jsx');
        case 'colleges':
          return import('../pages/CollegesPage.jsx');
        case 'college-mentors':
          return import('../pages/CollegeMentorsPage.jsx');
        case 'become-mentor':
          return import('../pages/BecomeMentor.jsx');
        case 'profile':
          return import('../pages/User/Home.jsx');
        case 'mentor-profile':
          return import('../pages/MentorProfilePage.jsx');
        case 'settings':

          break;
        default:
          return Promise.resolve();
      }
    });

    await Promise.all(routePromises);
    // console.log('Preloaded predicted routes:', predictedRoutes);
  } catch (error) {
    console.warn('Error preloading predicted routes:', error);
  }
};


export const intelligentPreload = async (user) => {
  if (!user) {

    await preloadCriticalRoutes('guest');
    return;
  }

  const { role, hasCompletedOnboarding, isActiveMentor } = user;


  await preloadCriticalRoutes(role);


  if (role === 'mentor') {
    if (!hasCompletedOnboarding) {
      await preloadPredictedRoutes(['become-mentor']);
    }
    if (isActiveMentor) {
      await preloadPredictedRoutes(['settings']);
    }
  } else if (role === 'user') {
    await preloadPredictedRoutes(['mentors', 'colleges']);
  }


  setTimeout(() => {
    preloadHeavyLibraries('ui');
  }, 2000);
};


export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};


export const preloadFonts = (fontUrls) => {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};