// Wait for the HTML document to fully load
document.addEventListener('DOMContentLoaded', function () {
    // Get the HTML element for the user selection dropdown
    const userSelection = document.getElementById('search');

    // Function to update user information in the UI
    function updateUserInfo(userDetails) {
        document.getElementById('real-name').textContent = userDetails.name;
        document.getElementById('username').textContent = `@${userDetails.username}`;
        document.getElementById('info').textContent = userDetails.website;
        document.getElementById('face-to-face').textContent = userDetails.company.catchPhrase;
        document.getElementById('location').textContent = userDetails.address.city;
    }

    // Function to update user posts and associated comments
    function updatePostsAndComments(selectedUserId) {
        // Fetch posts for the selected user from the API
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`)
            .then(response => response.json())
            .then(posts => {
                // Loop through the first 10 posts for the user
                posts.slice(0, 10).forEach((post, index) => {
                    // Get the HTML elements for user tweets in the UI
                    const userTweet = document.getElementById(`user-tweet${index + 1}`);
                    const userRightTweet = document.getElementById(`user-tweet-${index + 1}`);

                    // Check if the UI elements exist
                    if (userTweet && userRightTweet) {
                        // Update user tweets in the UI with post content
                        userTweet.textContent = userRightTweet.textContent = post.body;

                        // Fetch comments for the current post
                        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                            .then(response => response.json())
                            .then(comments => {
                                // Get the HTML element for the right name associated with the user tweet
                                const userRightName = document.getElementById(`name-right${index + 1}`);
                                if (userRightName) {
                                    // Update the right name in the UI with the first comment's name
                                    userRightName.textContent = comments.length > 0 ? comments[0].name : '';
                                }
                            })
                            .catch(error => console.error('Error fetching comments:', error));
                    }
                });
            })
            .catch(error => console.error('Error fetching user posts:', error));
    }

    // Fetch users from the API and populate the user selection dropdown
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
            // Loop through the users and add them as options to the dropdown
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
        // Get the selected user ID from the dropdown
        const selectedUserId = userSelection.value;

        // Fetch user details and update the UI
        fetch(`https://jsonplaceholder.typicode.com/users/${selectedUserId}`)
            .then(response => response.json())
            .then(userDetails => {
                // Update user information in the UI
                updateUserInfo(userDetails);
                // Update user posts and comments in the UI
                updatePostsAndComments(selectedUserId);
            })
            .catch(error => console.error('Error fetching user details:', error));
    });
});
