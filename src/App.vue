<script>
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3005';

// Подключаем библиотеку 
// и перевод дат на русский язык
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');


export default {
    data() {
        return {
            month: 'all',
            events: [],
            event: null,
            eventIndex: null
        };
    },

    methods: {
        select(index) {
            this.event = this.events[index]
            this.eventIndex = index;
        },

        getDay(item) {
            return dayjs(item.date).format('DD MMMM');
        },

        getTime(item) {
            return dayjs(item.data).format('HH:mm')
        },

        search() {
            if (this.month == 'all') {
                this.loadAll();
            } else if (this.month == 'next') {
                this.loadNext();
            } else if (this.month == 'june') {
                this.loadJune();
            } else if (this.month == 'july') {
                this.loadJuly();
            }
        },

        async loadAll() {
            let response = await axios.get('events/all');
            this.events = response.data;
        },

        async loadNext() {
            let from = dayjs().toISOString();
            let response = await axios.get('events/next', {
                params: {
                    from: from
                }
            });
            this.events = response.data;
        },

        async loadJune() {
            let from = dayjs('2023-06-01').toISOString();
            let to = dayjs('2023-07-01').toISOString();
            let response = await axios.get('/events/search', {
                params: {
                    from: from,
                    to: to
                }
            });
            this.events = response.data;
        },

        async loadJuly() {
            let from = dayjs('2023-07-01').toISOString();
            let to = dayjs('2023-08-01').toISOString();
            let response = await axios.get('/events/search', {
                params: {
                    from: from,
                    to: to
                }
            });
            this.events = response.data;
        },

        async register(item) {
            console.log(item._id);
            let response = await axios.post('/events/register', {
                params: {
                    id: item._id
                }
            });
            this.event = response.data
        }
    },
    mounted() {
        this.loadAll();
    }
};
</script>

<template>
    <div class="app">
        <div class="container my-3">
            <div class="row row-cols-2 justify-content-center">

                <!-- Список событий -->
                <div class="col">
                    <!-- Поле поиска -->
                    <div class="input-group mb-3">
                        <select @change="search" v-model="month" class="form-select form-select-lg">
                            <option value="all">Все события</option>
                            <option value="next">Скоро</option>
                            <option value="june">Июнь</option>
                            <option value="july">Июль</option>
                        </select>
                    </div>

                    <!-- Карточки событий -->
                    <ul class="list-group">
                        <li
                            v-for="(item, index) in events" 
                            @click="select(index)"
                            class="list-group-item"
                            :class="{
                                'selected': eventIndex == index
                            }"
                        >
                            <div class="event-date">
                                {{ getDay(item) }}
                            </div>

                            <div class="event-title">
                                {{ item.title }}
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div
                    v-if="event"
                    class="col show-event">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h2 class="card-title">
                                {{ event.title }}
                            </h2>
                            <p class="card-text">
                                {{ event.description }}
                            </p>
                            <p class="card-text">
                            <div class="event-time">
                                {{ getDay(event) }} в {{ getTime(event) }}
                            </div>

                            <div class="event-tickets">
                                <div v-if="event.ticketsCount > 0">
                                    <p>
                                        Свободных мест: {{ event.ticketsCount }}
                                    </p>

                                    <button
                                        class="btn btn-primary"
                                        @click="register(event)"
                                    >
                                        Зарегистрироваться
                                    </button>
                                </div>
                                <p v-else>Билетов больше нет</p>
                            </div>


                            </p>
                        </div>
                        <img :src="'src/assets/' + event.image" class="card-img-bottom" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
body {
    background-color: lightgray;
}

.search-input {
    font-size: 40px;
    text-align: center;
}

.list-group-item {
    display: flex;
    cursor: pointer;
    margin: 4px 0;
    border: none;
    border-radius: 4px;
    /* background-color: aliceblue; */
    /* border-top: 1px; */
}

.list-group-item.selected {
    outline: 2px solid blueviolet;
}

.list-group-item .event-date {
    width: 100px;
    font-size: 30px;
    /* color: white; */
    /* background-color: #0d6efd; */
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.list-group-item .event-title {
    flex: 1;
    padding: 0 14px;
}

.show-event .event-time {
    font-size: 30px;
    margin-bottom: 10px;
}
</style>
