const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0 
    : blogs.reduce(reducer, 0)
}

const favouriteBlog = blogs => {
  const reducer = (blog1, blog2) => {
    return blog1.likes > blog2.likes ? blog1 : blog2
  }
  return blogs.reduce(reducer)
}

const mostBlogs = blogs => {
  const blogsPerAuthor = {}
  
  blogs.forEach(blog => {
    if (!blogsPerAuthor[blog.author]) {
      blogsPerAuthor[blog.author] = 0
    }
    blogsPerAuthor[blog.author] += 1
  })

  const blogsPerAuthorEntries = Object.entries(blogsPerAuthor)
  const reducer = (entry1, entry2) => {
    return entry1[1] > entry2[1] ? entry1 : entry2
  }
  const reduced = blogsPerAuthorEntries.reduce(reducer)
  return {
    'author': reduced[0],
    'blogs': reduced[1]
  }
}

const mostLikes = blogs => {
  const likesPerAuthor = {}
  
  blogs.forEach(blog => {
    if (!likesPerAuthor[blog.author]) {
      likesPerAuthor[blog.author] = 0
    }
    likesPerAuthor[blog.author] += blog.likes
  })

  const likesPerAuthorEntries = Object.entries(likesPerAuthor)
  const reducer = (entry1, entry2) => {
    return entry1[1] > entry2[1] ? entry1 : entry2
  }
  const reduced = likesPerAuthorEntries.reduce(reducer)
  return {
    'author': reduced[0],
    'likes': reduced[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
