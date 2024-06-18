import { createResource, type Component, createSignal, For } from 'solid-js';

import styles from './App.module.css';

const fetchPosts = async () => (await fetch('/api/posts')).json();
const addPost = async (text: string) => { await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({ text: text }),
  headers: {
    'Content-Type': 'application/json'
  }
}) };

const App: Component = () => {

  const [posts, setPosts] = createSignal([]);
  let area: HTMLTextAreaElement | undefined;


  const getAll = () => {
    fetchPosts()
      .then((value: any) => setPosts(value));
  };

  const submit = (text: string) => {
    addPost(text)
      .then(() => getAll())
  };

  getAll();

  return (
    <div class={styles.App}>
      <h1>TWITTOR</h1>
      <textarea ref={area}></textarea>
      <button onClick={() => submit(area?.value ?? '')}>submit</button>

      <For each={posts()}>{(item: any) => 
        <div>{item}</div>
      }</For>
    </div>
  );
};

export default App;
