define(['jquery', 
    'underscore', 
    'knockout-mapping', 
    'views/forms/base', 
    'views/forms/sections/branch-list',
    'views/forms/sections/validation',
    'bootstrap-datetimepicker',], 
    function ($, _, koMapping, BaseForm, BranchList,ValidationTools) {
        var vt = new ValidationTools;
        return BaseForm.extend({
            initialize: function() {
                BaseForm.prototype.initialize.apply(this);                
                
                var self = this;
                var date_picker = $('.datetimepicker').datetimepicker({pickTime: false});
                date_picker.on('dp.change', function(evt){
                    $(this).find('input').trigger('change'); 
                });
                
                this.addBranchList(new BranchList({
                    el: this.$el.find('#overall-site-condition')[0],
                    data: this.data,
                    dataKey: 'OVERALL_CONDITION_STATE_TYPE.E55',
                    rules: true,
                    validateBranch: function (nodes) {
                        return this.validateHasValues(nodes);
                    }
                }));
                
                this.addBranchList(new BranchList({
                    el: this.$el.find('#damage-overall-extent')[0],
                    data: this.data,
                    dataKey: 'DAMAGE_EXTENT_TYPE.E55',
                    rules: true,
                    validateBranch: function (nodes) {
                        return this.validateHasValues(nodes);
                    }
                }));
                
                this.addBranchList(new BranchList({
                    el: this.$el.find('#disturbances')[0],
                    data: this.data,
                    dataKey: 'DAMAGE_STATE.E3',
                    rules: true,
                    validateBranch: function (nodes) {
                        var canBeEmpty = [
                            'DISTURBANCE_CAUSE_ASSIGNMENT_ASSESSOR_NAME.E41',
                            'DISTURBANCE_DATE_FROM.E61',
                            'DISTURBANCE_DATE_TO.E61',
                            'DISTURBANCE_DATE_OCCURRED_BEFORE.E61',
                            'DISTURBANCE_DATE_OCCURRED_ON.E61',
                            'EFFECT_TYPE_1.I4',
                            'EFFECT_CERTAINTY_1.I6',
                            'EFFECT_TYPE_2.I4',
                            'EFFECT_CERTAINTY_2.I6',
                            'EFFECT_TYPE_3.I4',
                            'EFFECT_CERTAINTY_3.I6',
                            'EFFECT_TYPE_4.I4',
                            'EFFECT_CERTAINTY_4.I6',
                            'EFFECT_TYPE_5.I4',
                            'EFFECT_CERTAINTY_5.I6',
                        ];
                        var mustHaveOneOf = [
                            'DISTURBANCE_DATE_FROM.E61',
                            'DISTURBANCE_DATE_TO.E61',
                            'DISTURBANCE_DATE_OCCURRED_BEFORE.E61',
                            'DISTURBANCE_DATE_OCCURRED_ON.E61',
                        ];
                        var datePair = [
                            'DISTURBANCE_DATE_FROM.E61',
                            'DISTURBANCE_DATE_TO.E61',
                        ]
                        var ck0 = this.validateHasValues(nodes, canBeEmpty);
                        var ck1 = vt.isValidDate(nodes,'DISTURBANCE_DATE_FROM.E61');
                        var ck2 = vt.isValidDate(nodes,'DISTURBANCE_DATE_TO.E61');
                        var ck3 = vt.isValidDate(nodes,'DISTURBANCE_DATE_OCCURRED_BEFORE.E61');
                        var ck4 = vt.isValidDate(nodes,'DISTURBANCE_DATE_OCCURRED_ON.E61');
                        var ck5 = vt.mustHaveAtLeastOneOf(nodes, mustHaveOneOf);
                        var ck6 = vt.ifOneThenAll(nodes, datePair);
                        console.log(ck0)
                        console.log(ck1)
                        console.log(ck2)
                        console.log(ck3)
                        console.log(ck4)
                        console.log(ck5)
                        console.log(ck6)
                        console.log(nodes)
                        console.log(this.data)
                        return ck0 && ck1 && ck2 && ck3 && ck4 && ck5 && ck6;
                    }
                }));
                
                this.addBranchList(new BranchList({
                    el: this.$el.find('#threats')[0],
                    data: this.data,
                    dataKey: 'THREAT_INFERENCE_MAKING.I5',
                    rules: true,
                    validateBranch: function (nodes) {
                        var canBeEmpty = ['THREAT_INFERENCE_MAKING_ASSESSOR_NAME.E41',
                        'THREAT_CATEGORY.I4'];
                        return this.validateHasValues(nodes, canBeEmpty);

                    }
                }));
                
                this.addBranchList(new BranchList({
                    el: this.$el.find('#type-of-recommendation')[0],
                    data: this.data,
                    dataKey: 'RECOMMENDATION_PLAN.E100',
                    validateBranch: function (nodes) {
                        return this.validateHasValues(nodes);
                    }
                }));
                this.addBranchList(new BranchList({
                    el: this.$el.find('#priority')[0],
                    data: this.data,
                    dataKey: 'PRIORITY_ASSIGNMENT.E13',
                    validateBranch: function (nodes) {
                        return this.validateHasValues(nodes);
                    }
                }));

                this.listenTo(this,'change', this.dateEdit)
            },
            
            toggleEditActor: function (e) {
                var actorClass = e.target.dataset.actor;
                if ($(e.target).hasClass("show-box")) {
                    $(".show-box." + actorClass).addClass('hidden');
                    $(".hide-box." + actorClass).removeClass('hidden');
                    $(".edit-actors-row." + actorClass).removeClass('hidden');
                } else {
                    $(".show-box." + actorClass).removeClass('hidden');
                    $(".hide-box." + actorClass).addClass('hidden');
                    $(".edit-actors-row." + actorClass).addClass('hidden');
                }
            },
            
            dateEdit: function (e, b) {
                _.each(b.nodes(), function (node) {
                    if (node.entitytypeid() == 'DISTURBANCE_DATE_FROM.E61' && node.value() && node.value() != '') {
                        $('.div-date').addClass('hidden')
                        $('.div-date-from-to').removeClass('hidden')
                        $('.disturbance-date-value').html('From-To')
                    } else if (node.entitytypeid() == 'DISTURBANCE_DATE_OCCURRED_ON.E61' && node.value() && node.value() != '') {
                        $('.div-date').addClass('hidden')
                        $('.div-date-on').removeClass('hidden')
                        $('.disturbance-date-value').html('On')
                    } else if (node.entitytypeid() == 'DISTURBANCE_DATE_OCCURRED_BEFORE.E61' && node.value() && node.value() != '') {
                        $('.div-date').addClass('hidden')
                        $('.div-date-before').removeClass('hidden')
                        $('.disturbance-date-value').html('Before')
                    }
                })
            },
            
            showDate: function (e) {
                $('.div-date').addClass('hidden')
                $('.disturbance-date-value').html($(e.target).html())
                if ($(e.target).hasClass("disturbance-date-from-to")) {
                    $('.div-date-from-to').removeClass('hidden')
                } else if ($(e.target).hasClass("disturbance-date-on")) {
                    $('.div-date-on').removeClass('hidden')
                } else if ($(e.target).hasClass("disturbance-date-before")) {
                    $('.div-date-before').removeClass('hidden')
                }
            },
            
            events: function(){
                var events = BaseForm.prototype.events.apply(this);
                events['click .edit-actor'] = 'toggleEditActor';
                events['click .edit-actor-threat'] = 'toggleEditActor';
                events['click .disturbance-date-item'] = 'showDate';
                events['click .disturbance-date-edit'] = 'dateEdit';
                return events;
            },

        });
    }
);

$(function($) {
    PlusMinus = true;	
    $('#plusminus').click(function() {
        var wasPlay = $(this).hasClass('fa-plus-square');
        $(this).removeClass('fa-plus-square fa-minus-square');
        var klass = wasPlay ? 'fa-minus-square' : 'fa-plus-square';
        $(this).addClass(klass)
        if (PlusMinus == true) {
            $('#tobehidden').show();
        } else {
            $('#tobehidden').hide();
        }
        PlusMinus = !PlusMinus;
    }); 
 });