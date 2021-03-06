/**
 * Created with IntelliJ IDEA.
 * User: mtschimev
 * Date: 20.01.13
 * Time: 18:06
 */
define(
    [
        'jquery',
        'underscore',
        'backbone',
        'collections/slides/SlidesCollection',
        'views/slides/SlideThumb',
        'models/slides/Slide'
    ],
    function ($, _, Backbone, SlidesCollection, SlideView, SlideModel) {

        var SlideContainer = Backbone.View.extend({
            el: $('.slide-container'),

            events: {
                'click #js_add-slide': 'addSlide'
            },

            initialize: function () {
                _.bindAll(this, 'render', 'removeSlide', 'addSlide', 'appendSlide', 'changeSelection');

                this.collection = new SlidesCollection();
                this.collection.bind("remove", this.removeSlide);
                this.collection.bind("add", this.appendSlide);
                this.collection.bind("change:selected", this.changeSelection);

                this.counter = 0;

                this.render();
            },

            render: function () {
                var self = this;

                if (this.collection.models.length > 1) {
                    _(this.collection.models).each(function (slide) { // in case collection is not empty
                        self.addSlide(slide);
                    }, this);
                }
                if (this.collection.models.length === 0) {
                    this.addSlide();
                }
            },

            addSlide: function () {
                var slide = new SlideModel();
                this.counter++;

                slide.set({
                    number: this.counter
                });

                this.collection.add(slide);
            },

            appendSlide: function (slideModel) {
                var slideView = new SlideView({
                    model: slideModel
                });
                slideView.on('select', this.changeSelection);

                $(this.el).append(slideView.render().el);
            },

            removeSlide: function (slideModel, collection, information) {
                var i, wasSelected = slideModel.get('selected');
                this.counter--;

                for (i = collection.models.length - 1; i > information.index - 1; i--) {
                    collection.models[i].set({
                        number: i + 1
                    });
                }
                if (wasSelected) {
                    this.changeSelection(slideModel);
                }
            },

            changeSelection: function (slideModel) {
                var i;

                if (slideModel.changed.selected === true) {
                    this.trigger('selectSlide', slideModel);
                    for (i = this.collection.models.length; i--;) {
                        var model = this.collection.at(i);
                        if(slideModel !== model) {
                            model.set({
                                selected: false
                            });
                        }
                    }
                }
            }
        });

        return SlideContainer;
    }
);