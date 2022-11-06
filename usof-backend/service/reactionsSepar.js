
function reactionsSepar(reactions, id) {
  let postsReactionsArr = [];
  if (!reactions) {
    postsReactionsArr = {
      id: id,
      likes: [],
      dislikes: []
    };
  } else {
    let likesArr = [], dislikesArr = [];
    for (const reaction of reactions) {
      if (reaction.type === true) {
        likesArr.push(reaction);
      } else {
        dislikesArr.push(reaction);
      }
    }
    postsReactionsArr = {
      id: id,
      likes: likesArr,
      dislikes: dislikesArr
    };
  }

  return postsReactionsArr;
}

export default reactionsSepar;
