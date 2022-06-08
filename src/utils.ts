import {TotalDuration} from './types';

export const convertDuration = (sec: number): TotalDuration => {
  const hours = Math.floor(sec / 3600);
  if (hours >= 1) {
    sec = sec - hours * 3600;
  }
  const min = Math.floor(sec / 60);
  if (min >= 1) {
    sec = sec - min * 60;
  }
  const timeDuration: TotalDuration = {
    m: `${min < 10 ? '0' + min : min}`,
    s: `${sec < 10 ? '0' + sec : sec}`
  };
  if (hours) {
    timeDuration.h = `${hours < 10 ? '0' + hours : hours}`;
  }
  return timeDuration;
};

export const prepareTime = (sec: number): string => {
  const duration = convertDuration(sec);
  let result = '';
  if (duration.h) {
    result += `${duration.h}:`;
  }
  return `${result}${duration.m}:${duration.s}`;
};
