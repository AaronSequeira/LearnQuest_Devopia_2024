import { createCampaign,bulbs,home,prof, dashboard, logout, payment, profile, Quiz, Leaderboard, Duel, Atom } from '../assets';


export const navlinks = [
  {
    name: 'Home',
    imgUrl: home,
    link: '/',
  },
  {
    name: 'Dashboard',
    imgUrl: dashboard,
    link: '/dashboard',
  },
  {
    name: 'Recommeder',
    imgUrl: bulbs,
    link: '/quiz',
  },
  {
    name: 'Profile',
    imgUrl: prof,
    link: '/quiz',
  },
  {
    name: 'Logout',
    imgUrl: logout,
    link: '/',
    disabled: false,
  },
];
