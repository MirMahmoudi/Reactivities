import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestError from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';

function App() {
  const {key} = useLocation();
  return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar/>
      <Route exact path='/' component={HomePage}/>
        <Route path={'/(.+)'}
          render = {() => (
            <>
              <NavBar/>
              <Container style={{marginTop:'7em'}}>
                <Switch>
                  <Route exact path='/activities' component={ActivityDashBoard}/>
                  <Route exact path='/activities/:id' component={ActivityDetails}/>
                  <Route key={key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
                  <Route path='/errors' component={TestError}/>
                  <Route path='/server-error' component={ServerError}/>
                  <Route path='/not-found' component={NotFound}/>
                </Switch>
              </Container>
            </>
          )}
        />
    </>
  );
}

export default observer(App);
