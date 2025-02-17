import { Container } from '@material-ui/core';
import BookCard from 'components/book-card/book-card';
import BookList from 'components/book-list/book-list';
import { ErrorAlert } from 'components/error/error-alert';
import Loading from 'components/loading/loading';
import { useFindAll } from 'hooks/book.hook';
import { useEmptyPromise } from 'hooks/promise.hook';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { findAll } from 'services/book.service';

const loadData = () => {
  return Promise.all([
    findAll({ page: 0, endReleaseDate: new Date(Date.now()), limit: 10, order: 'desc', sort: 'releaseDate' }),
    findAll({ page: 0, startReleaseDate: new Date(Date.now()), limit: 10, order: 'asc', sort: 'releaseDate' }),
  ]);
};
const useLoadData = () => useEmptyPromise(loadData);

const HomepageContent = () => {
  const { loading, data, error, execute } = useLoadData();

  useEffect(() => {
    execute();
  }, []);

  useEffect(() => {
    document.title = 'Home | BookBrowser';
  }, []);

  if (loading) {
    return <Loading />
  } else if (error) {
    return <ErrorAlert uiMessage="Unable to data" error={error} />
  } else if (data) {
    return (
      <div>
        <h3>Recent Releases</h3>
        {data[0].items && <BookList books={data[0].items}/>}
        <div className="d-flex mb-3">
          <Link to="/recent">View More</Link>
        </div>
        <hr />
        <h3>Coming Soon</h3>
        {data[1].items && <BookList books={data[1].items}/>}
        <div className="d-flex">
          <Link to="/coming-soon">View More</Link>
        </div>
      </div>
    );
  }
  return null;
};

const Homepage = () => {
  return (
    <Container maxWidth="md" className="mt-3">
      <HomepageContent />
    </Container>
  );
};

export default Homepage;
