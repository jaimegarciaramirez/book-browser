import { CircularProgress, Container } from '@material-ui/core';
import { ErrorAlert } from 'components/error/error-alert';
import SeriesForm from 'components/form/series-form/series-form';
import Loading from 'components/loading/loading';
import { NotFound } from 'components/message/not-found/not-found';
import { useGetById, useSave } from 'hooks/series.hook';
import React, { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Button } from 'react-bootstrap';
import { useParams, useHistory, Link, Prompt } from 'react-router-dom';
import { ApiError } from 'types/api-error';
import { Series } from 'types/series';

const UNSAVED_MESSAGE = "Are you sure that you want to leave with unsaved changes?";

const EditSeriesPageContent = () => {
  const { id } = useParams();
  const history = useHistory();
  const { data: loadedSeries, execute: load, loading: loadingSeries, error: loadError } = useGetById();
  const { data: savedSeries, execute: save, loading: savingSeries, error: saveError } = useSave();
  const notFound = loadError?.name === 'ApiError' && (loadError as ApiError)?.status === 404 ;

  const [series, setSeries] = useState<Series>();
  const [saved, setSaved] = useState(true);

  const onChange = (changedSeries: Series) => {
    setSeries(changedSeries);
    setSaved(false);
  }

  const onSubmit = (changedSeries: Series) => {
    save(changedSeries);
  }

  const reset = () => {
    setSeries(savedSeries || loadedSeries);
  }

  const cancel = () => {
    history.push(`/series/${series!.id}`);
  }

  useEffect(() => {
    if (series) {
      document.title = `Edit ${(savedSeries || loadedSeries).title}${saved ? '' : '*'} | SeriesBrowser`;
    } else {
      document.title = 'Edit | SeriesBrowser';
    }
  }, [series, saved]);

  useEffect(() => {
    load(id);
  }, [id]);

  useEffect(() => {
    if (loadedSeries) {
      setSeries(loadedSeries);
    }
  }, [loadedSeries])

  useEffect(() => {
    if (savedSeries) {
      setSeries(savedSeries);
      setSaved(true);
    }
  }, [savedSeries]);

  if (loadingSeries) {
    return <Loading />;
  }
  if (notFound) {
    return <NotFound />;
  }
  if (loadError) {
    return <ErrorAlert uiMessage="Something went wrong. Unable to load this entry." error={loadError} />;
  }
  if (series) {
    return (
      <div>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{to: "/home"}}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{to: "/series"}}>Series</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{to: `/series/${series!.id}`}}>{(savedSeries || loadedSeries)?.title}</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="heading-main">Edit Series</h1>
          <SeriesForm
            value={series}
            onChange={onChange}
            onSubmit={onSubmit}
            footer={
              <div>
                {saveError && <ErrorAlert uiMessage="Something went wrong. Unable to save this entry." error={saveError} />}
                {!saveError && savedSeries && <Alert variant="success" className="mb-2">Changes successfully saved</Alert>}
                <>
                  <div className="d-flex">
                    <Button className="mr-2" variant="secondary" disabled={savingSeries} onClick={cancel}>Cancel</Button>
                    <Button className="mr-auto" variant="secondary" disabled={savingSeries} onClick={reset}>Reset</Button>
                    <Button variant="primary" type="submit" disabled={savingSeries}>
                      {!savingSeries && <span>Save</span>}
                      {savingSeries && <span>Saving <CircularProgress color="secondary" size={"15px"} /></span>}
                    </Button>
                  </div>
                </>
              </div>
            }
          />
          <Prompt when={!saved} message={UNSAVED_MESSAGE} />
        </div>
    )
  }
  return null;
}

const EditSeriesPage = () => {
  return (
    <Container maxWidth="md" className="mt-3">
      <EditSeriesPageContent />
    </Container>
  )
}

export default EditSeriesPage;