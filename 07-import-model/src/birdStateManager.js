import { BirdState } from './BirdStates';

class BirdStateManager {
    constructor() {
        this.currentState = BirdState.FLOCKING;
        this.subscribers = new Set();
    }

    setState(newState) {
        this.currentState = newState;
        this.notifySubscribers();
    }

    subscribe(bird) {
        this.subscribers.add(bird);
        bird.state = this.currentState;
    }

    notifySubscribers() {
        this.subscribers.forEach(bird => {
            bird.state = this.currentState;
        });
    }
    returnSubscribers(){
        return this.subscribers;
    }
}

export const birdStateManager = new BirdStateManager();