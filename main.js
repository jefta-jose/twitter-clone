document.addEventListener('DOMContentLoaded', function () {
    const userSelection = document.getElementById('search');

    function updateUserInfo(userDetails) {
        document.getElementById('real-name').textContent = userDetails.name;
        document.getElementById('username').textContent = `@${userDetails.username}`;
        document.getElementById('info').textContent = userDetails.website;
        document.getElementById('face-to-face').textContent = userDetails.company.catchPhrase;
        document.getElementById('location').textContent = userDetails.address.city;
    }

    function updatePostsAndComments(selectedUserId) {
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`)
            .then(response => response.json())
            .then(posts => {
                posts.slice(0, 10).forEach((post, index) => {
                    const userTweet = document.getElementById(`user-tweet${index + 1}`);
                    const userRightTweet = document.getElementById(`user-tweet-${index + 1}`);
                    if (userTweet && userRightTweet) {
                        userTweet.textContent = userRightTweet.textContent = post.body;

                        // Load comments for each post
                        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                            .then(response => response.json())
                            .then(comments => {
                                const userRightName = document.getElementById(`name-right${index + 1}`);
                                if (userRightName) {
                                    userRightName.textContent = comments.length > 0 ? comments[0].name : '';
                                }
                            })
                            .catch(error => console.error('Error fetching comments:', error));
                    }
                });
            })
            .catch(error => console.error('Error fetching user posts:', error));
    }

    // Fetch users from the API and populate the select box
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.username;
                userSelection.add(option);
            });

            // By default, display user with ID one
            userSelection.value = 1;

            // Trigger change event to load default user details and posts
            userSelection.dispatchEvent(new Event('change'));
        })
        .catch(error => console.error('Error fetching users:', error));

    // Event listener for user selection change
    userSelection.addEventListener('change', function () {
        const selectedUserId = userSelection.value;

        // Fetch user details and update the corresponding DOM elements
        fetch(`https://jsonplaceholder.typicode.com/users/${selectedUserId}`)
            .then(response => response.json())
            .then(userDetails => {
                updateUserInfo(userDetails);
                updatePostsAndComments(selectedUserId);
            })
            .catch(error => console.error('Error fetching user details:', error));
    });
});
