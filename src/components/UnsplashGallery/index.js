import './style.scss';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { CHANGE_BOARD_IMAGE_MUTATION } from '../../helpers/mutations';
import { CSSTransition } from 'react-transition-group';
import InfiniteScroll from 'react-infinite-scroller';
import MiniLoader from '../Loader/MiniLoader';
import { changeBoardImageBG } from '../../reducer/actions';
import context from '../../context';
import { createApi } from 'unsplash-js';
import { useMutation } from '@apollo/client';

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
});

const UnsplashGallery = () => {
  const { state, dispatch } = useContext(context);
  const [query, setQuery] = useState('breath');
  const [pics, setPics] = useState([]);
  const [isVisibleSettings, setIsVisibleSettings] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [perPage, setPerPage] = useState(20);
  const [submitedQuery, setSubmitedQuery] = useState('');

  const scrollRef = useRef(null);

  const [changeBoardImage, { loading }] = useMutation(
    CHANGE_BOARD_IMAGE_MUTATION
  );

  const { currentBoard } = state || {};

  const searchPhotos = async (e) => {
    if (e && typeof e !== 'number') {
      e.preventDefault();
      if (submitedQuery !== query) {
        setPics([]);
        setCurrentPageNumber(1);
      }
    }

    unsplash.search
      .getPhotos({
        query,
        orientation: 'landscape',
        page: currentPageNumber,
        perPage,
      })
      .then((result) => {
        if (result.errors) {
          // handle error here
          console.error('error occurred: ', result.errors[0]);
        } else {
          // handle success here
          const photo = result.response;
          setPics((prevState) => [...prevState, ...photo.results]);
          setCurrentPageNumber((prevState) => prevState + 1);
          setHasMore(currentPageNumber <= Math.ceil(photo.total / perPage));
          setSubmitedQuery(query);
        }
      });
  };

  useEffect(() => {
    if (isVisibleSettings) {
      setTimeout(() => {
        searchPhotos();
      }, 250);
    }
  }, [isVisibleSettings]);

  function SettingsButton() {
    return (
      <button
        className="settings_button__open"
        onClick={() => setIsVisibleSettings(true)}>
        <i
          className="fas fa-cogs"
          style={{
            fontSize: 34,
            color: '#5d5d5d',
          }}
        />
      </button>
    );
  }

  const onImageClickHandler = (image) => {
    const newImage = image.urls.regular.replace(/w=\d*/, 'w=1950');
    dispatch(changeBoardImageBG(newImage));
    changeBoardImage({
      variables: { boardID: currentBoard.id, image: newImage },
    });
  };

  const onCloseSettingsHandler = () => {
    setPics([]);
    setCurrentPageNumber(1);
    setIsVisibleSettings(false);
  };

  return (
    <div>
      <CSSTransition
        in={isVisibleSettings}
        classNames="settings"
        timeout={300}
        unmountOnExit>
        <div className="settings_wraper">
          <div className="row end-xs">
            <div className="col-xs">
              <button
                onClick={onCloseSettingsHandler}
                className="settings_exit">
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <form className="form col-xs" onSubmit={searchPhotos}>
                <label className="label" htmlFor="query" />
                <p className="input-wrapper">
                  <input
                    type="text"
                    name="query"
                    placeholder={`Try "dog" or "apple"`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <i className="fas fa-search" />
                </p>
              </form>

              <div
                style={{
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  height: 'calc(100vh - 173px)',
                }}
                ref={scrollRef}>
                <InfiniteScroll
                  loadMore={searchPhotos}
                  hasMore={hasMore}
                  pageStart={1}
                  loader={<MiniLoader />}
                  initialLoad={false}
                  threshold={150}
                  useWindow={false}>
                  <div className="unsplash-card-list row">
                    {pics &&
                      pics.length > 0 &&
                      pics.map((pic) => (
                        <button
                          className="unsplash-card col-md-6"
                          key={pic.id}
                          onClick={() => onImageClickHandler(pic)}>
                          <img
                            className="unsplash-card--image"
                            alt={pic.alt_description}
                            src={pic.urls.thumb}
                          />
                          <a
                            className="photo-attribution-component-attribution-link"
                            href={pic.user.links.html}>
                            {pic.user.name}
                          </a>
                        </button>
                      ))}
                  </div>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
      {!isVisibleSettings && <SettingsButton />}
    </div>
  );
};

export default UnsplashGallery;
