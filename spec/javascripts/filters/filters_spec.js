describe("Filters", function() {
  
  beforeEach(module('getHired'));

  describe('link', function() {
    var linkFilter;
    beforeEach(inject(function(_linkFilter_) {
      linkFilter = _linkFilter_;
    }));
    
    it("should properly format links", function() {
      expect(linkFilter("https://www.google.com/search?q=meow&ie=utf-8&oe=utf-8")).toBe("www.google.com");
    });
    it("should properly format links", function() {
      expect(linkFilter("https://news.ycombinator.com/item?id=9127232")).toBe("news.ycombinator.com");
    });
    it("should format https scheme", function() {
      expect(linkFilter("https://angel.co/karmic-labs-1/jobs/31466-frontend-engineer")).toBe("angel.co");
    });
    it("should format https scheme", function() {
      expect(linkFilter("https://get-hired-app.herokuapp.com/#/jobs/edit/13")).toBe("get-hired-app.herokuapp.com");
    });
  });
});
