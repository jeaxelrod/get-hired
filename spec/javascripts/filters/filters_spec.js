describe("Filters", function() {
  
  beforeEach(module('getHired'));

  describe('link', function() {
    var linkFilter;
    beforeEach(inject(function(_linkFilter_) {
      linkFilter = _linkFilter_;
    }));
    
    it("should format http scheme", function() {
      expect(linkFilter("http://google.com")).toBe("google.com");
    });
    it("should format https scheme", function() {
      expect(linkFilter("https://google.com")).toBe("google.com");
    });
  });
});
