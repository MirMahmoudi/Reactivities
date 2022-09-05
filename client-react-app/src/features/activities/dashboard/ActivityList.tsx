import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Button, Item, Label } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

function ActivityList() {

    const { activityStore } = useStore();
    const {activitiesByDate, deleteActivity, loading} = activityStore;

    const [target, setTarget] = useState('');

    const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(e.currentTarget.name);
        deleteActivity(id)
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(act => (
                    <Item key={act.id}>
                        <Item.Content>
                            <Item.Header as='a'>{act.title}</Item.Header>
                            <Item.Meta>{act.date}</Item.Meta>
                            <Item.Description>
                                <div>{act.description}</div>
                                <div>{act.city}, {act.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                name={act.id}
                                    loading={loading &&  act.id === target}
                                    onClick={(e)=> handleActivityDelete(e, act.id)}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                />
                                <Button as={Link} to={`/activities/${act.id}`} floated='right' content='View' color='blue'/>
                                <Label basic content={act.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList);