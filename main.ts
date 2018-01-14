import {Observable} from "rxjs";

const button = document.querySelector('button');
const output = document.querySelector('#output');

let click = Observable.fromEvent(button, 'click');

function load(url: string) {

    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
                //console.table(data);
            }
            else {
                //zawsze kiedy połączenia z serwerem to trzeba obsłużyć błędy na wypadek problemó z transmisją danych
                observer.error(xhr.statusText);
            }
        })
        xhr.open("GET", url);
        xhr.send();
    }).retryWhen((errors, limit = 5, delay = 1000) => {
        return errors
            .takeWhile((e, i) => {
                console.log(i);
                return i < limit; //ogranicza ilość prób
            })
            .delay(delay); //co ile ponawiamy próbę
    })
}

function renderBooks(books) {
    //sortBooks(books);
    books.forEach(b => {
        let node = document.createElement('div');
        node.innerText = b.title + ", liczba stron: " + b.pages;
        output.appendChild(node);
    })
}

//function sortBooks(books){
//    books.sort((e1,e2) => e2.pages - e1.pages);
//}

//poniższa linijka łączy dwa streamy z różnych obserwatorów
click.flatMap(e => load("/books-api1.json"))
    .subscribe(
        (e) => renderBooks(e),
        (e) => console.log(`error ${e}`),
        () => console.log('Done')
    )