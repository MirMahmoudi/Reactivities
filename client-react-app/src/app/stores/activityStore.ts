import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { format } from 'date-fns';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate () {
        return Array.from(this.activityRegistry.values())
                .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivity () {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            },{} as {[key:string]: Activity[]})
        )
    }

    private setLoadingInitial = (state: boolean) => this.loadingInitial = state;
    private setSelectedActivity = (activity: Activity) => this.selectedActivity = activity;
    private getActivity = (id: string) => this.activityRegistry.get(id);
    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activitiesList = await agent.Activities.getDataList();
            activitiesList.forEach(activity => {
                this.setActivity(activity);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log('Error', error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.setSelectedActivity(activity);
            return activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.getDetails(id);
                this.setActivity(activity);
                this.setSelectedActivity(activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log('error', error);
                this.setLoadingInitial(false);
            }
        };
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction( () => {
                this.activityRegistry.set(activity.id, activity);
                this.setSelectedActivity(activity);
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log('Error', error)
            runInAction( () => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction( () => {
                this.activityRegistry.set(activity.id, activity);
                this.setSelectedActivity(activity);
                this.loading = false;
                this.editMode = false;
            })
        } catch (error) {
            console.log('Error', error);
            runInAction( () => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log('Error', error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}