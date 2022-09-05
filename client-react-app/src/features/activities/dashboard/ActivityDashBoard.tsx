import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilter from './ActivityFilter';

function ActivityDashBoard() {
    const { activityStore } = useStore();
    const { activityRegistry, loadActivities } = activityStore;

    useEffect(() => {
        if(activityRegistry.size <= 1) loadActivities();
    },[activityRegistry.size, loadActivities]);

    if(activityStore.loadingInitial) return <LoadingComponent content='Loading app...'/>

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilter />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashBoard);