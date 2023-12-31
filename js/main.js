// main.js
//
// Function 1: createElemWithText
function createElemWithText(elementType = 'p', textContent = '', className = '') {
  const element = document.createElement(elementType);
  element.textContent = textContent;
  if (className) {
    element.className = className;
  }
  return element;
}

// Function 2: createSelectOptions
function createSelectOptions(usersData) {
  if (!usersData) return undefined;
  const options = [];
  for (const user of usersData) {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }
  return options;
}

/// Function 3: toggleCommentSection
function toggleCommentSection(postId) {
  // Return undefined if postId parameter is not provided
  if (!postId) {
      console.warn('postId parameter not provided. Returning undefined.');
      return undefined;
  }
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (section) {
      section.classList.toggle('hide');
  }
  return section;
}


// Function 4: toggleCommentButton
function toggleCommentButton(postId) {
  if (!postId) {
    console.warn('postId parameter not provided. Returning undefined.');
    return undefined;
  }
  const button = document.querySelector(`[data-post-id="${postId}"]`);
  if (!button) {
    console.warn(`No button found for postId: ${postId}. Returning null.`);
    return null;
  }
  button.textContent = (button.textContent === 'Show Comments') ? 'Hide Comments' : 'Show Comments';
  return button;
}

// Function 5: deleteChildElements
function deleteChildElements(parentElement) {
  if (!parentElement || !(parentElement instanceof Element)) {
    console.warn('Invalid or missing parentElement. Returning undefined.');
    return undefined;
  }
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

// Function 6: addButtonListeners
function addButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (buttons) {
    buttons.forEach(button => {
      const postId = button.dataset.postId;
      if (postId) {
        button.addEventListener('click', (event) => toggleComments(event, postId));
      }
    });
  }
  return buttons;
}

// Function 7: removeButtonListeners
function removeButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (buttons) {
    buttons.forEach(button => {
      const postId = button.dataset.postId;
      if (postId) {
        button.removeEventListener('click', (event) => toggleComments(event, postId));
      }
    });
  }
  return buttons;
}

// Function 8: createComments
function createComments(commentsData) {
  if (!commentsData) {
    console.warn('commentsData parameter not provided. Returning undefined.');
    return undefined;
  }

  const fragment = document.createDocumentFragment();

  for (const comment of commentsData) {
    const article = document.createElement('article');
    const h3 = createElemWithText('h3', comment.name);
    const p1 = createElemWithText('p', comment.body);
    const p2 = createElemWithText('p', `From: ${comment.email}`);
    article.appendChild(h3);
    article.appendChild(p1);
    article.appendChild(p2);
    fragment.appendChild(article);
  }

  return fragment;
}


// Function 9: populateSelectMenu
function populateSelectMenu(usersData) {
  if (!usersData) {
    console.warn('usersData parameter not provided. Returning undefined.');
    return undefined;
  }
  const selectMenu = document.getElementById('selectMenu');
  if (!selectMenu) {
    console.warn('Select menu element not found. Make sure your HTML contains an element with id "selectMenu".');
    return undefined;
  }
  const options = createSelectOptions(usersData);
  options.forEach(option => selectMenu.appendChild(option));
  return selectMenu;
}


// Function 10: getUsers
async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const usersData = await response.json();
    return usersData;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Function 11: getUserPosts
async function getUserPosts(userId) {
  if (!userId) {
    console.warn('userId parameter not provided. Returning undefined.');
    return undefined;
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const postsData = await response.json();
    return postsData;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
}


// Function 12: getUser
async function getUser(userId) {
  if (!userId) {
    console.warn('userId parameter not provided. Returning undefined.');
    return undefined;
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return {};
  }
}


// Function 13: getPostComments
async function getPostComments(postId) {
  if (!postId) {
    console.warn('postId parameter not provided. Returning undefined.');
    return undefined;
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const commentsData = await response.json();
    return commentsData;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
}

// Function 14: displayComments
async function displayComments(postId) {
  if (!postId) {
    console.warn('postId parameter not provided. Returning undefined.');
    return undefined;
  }
  const section = document.createElement('section');
  section.dataset.postId = postId;
  section.classList.add('comments', 'hide');
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.appendChild(fragment);
  return section;
}

// Function 15: createPosts
async function createPosts(postsData) {
  if (!postsData) {
    console.warn('postsData parameter not provided. Returning undefined.');
    return undefined;
  }
  const fragment = document.createDocumentFragment();
  for (const post of postsData) {
    const article = document.createElement('article');
    const h2 = createElemWithText('h2', post.title);
    const p1 = createElemWithText('p', post.body);
    const p2 = createElemWithText('p', `Post ID: ${post.id}`);
    const author = await getUser(post.userId);
    const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
    const p4 = createElemWithText('p', author.company.catchPhrase);
    const button = document.createElement('button');
    button.textContent = 'Show Comments';
    button.dataset.postId = post.id;
    article.appendChild(h2);
    article.appendChild(p1);
    article.appendChild(p2);
    article.appendChild(p3);
    article.appendChild(p4);
    article.appendChild(button);
    const section = await displayComments(post.id);
    article.appendChild(section);
    fragment.appendChild(article);
  }
  return fragment;
}

// Function 16: displayPosts
const displayPosts = async (posts) => {
let myMain = document.querySelector("main");
let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
myMain.append(element);
return element;
}

// Function 17: toggleComments
function toggleComments(event, postId) {
  if (!event || !postId) {
      return undefined;
  }
  event.target.listener = true;
  let section = toggleCommentSection(postId);
  let button = toggleCommentButton(postId);
  return [section, button];
}

// Function 18: refreshPosts
const refreshPosts = async (posts) => {
if (!posts){
    return undefined;
}
let buttons = removeButtonListeners();
let myMain = deleteChildElements(document.querySelector("main"));
let fragment = await displayPosts(posts);
let button = addButtonListeners();
return [buttons, myMain, fragment, button];
}

// Function 19: selectMenuChangeEventHandler
const selectMenuChangeEventHandler = async (e) => {
  // Return undefined if the change event parameter is not provided
  if (!e) {
    console.warn('Change event parameter not provided. Returning undefined.');
    return undefined;
  }
  try {
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
  } catch (error) {
    console.error("An error occurred in selectMenuChangeEventHandler: ", error);
    return null;
  }
}

// Function 20: initPage
async function initPage() {
  const users = await getUsers();
  const selectMenu = populateSelectMenu(users);
  return [users, selectMenu];
}

// Function 21: initApp
async function initApp() {
  const [users, selectMenu] = await initPage();
  selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}
document.addEventListener('DOMContentLoaded', initApp);
