function displayResults(articles) {

  $("tbody").empty();
  articles.forEach(function (article) {

    var tr = $("<tr>").append(
      $("<td>").text(article.title),
      $("<td>").text("https://old.reddit.com" + article.url),
      $("<td>").text(article.submitted)
    )
    $("tbody").append(tr);
  });
}





$.getJSON("/all", function (data) {
  displayResults(data);
})