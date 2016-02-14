var React = require('react');
var classNames = require('classnames');

var ForceAuthMixin = require('../mixin/ForceAuthMixin');

var BillAction = require('../action/BillAction');

var LinkWithTooltip = require('./LinkWithTooltip'),
    LikeButtons = require('./LikeButtons');

module.exports = React.createClass({

    mixins: [
        ForceAuthMixin
    ],

    getInitialState: function()
    {
        return {
            activePart : null
        };
    },

    getDefaultProps: function()
    {
        return {
            editable: true
        };
    },

    renderHeaderTag : function(title, level)
    {
        switch (level) {
            case 1:
                return (<h1>{title}</h1>);
            case 2:
                return (<h2>{title}</h2>);
            case 3:
                return (<h3>{title}</h3>);
            case 4:
                return (<h4>{title}</h4>);
            case 5:
                return (<h5>{title}</h5>);
            case 6:
                return (<h6>{title}</h6>);
        }
    },

    renderHeader: function(title, level)
    {
        return (
            <div>
                <a name={title} className="bill-part-header-anchor"></a>
                <a href={location.pathname + '#' + title}>
                    {this.renderHeaderTag(title, level)}
                </a>
            </div>
        );
    },

    getSourceByURL: function(url)
    {
        for (var source of this.props.sources)
            if (source.url == url)
                return source;

        return null;
    },

    renderContent: function(content)
    {
        return content.map((para) => {
            return (
                <p>
                    {para.map((part) => {
                        if (typeof part == "string")
                            return part;
                        if (typeof part == "object" && part[0] == "link")
                        {
                            var source = this.getSourceByURL(part[1].href);

                            return (
                                <LinkWithTooltip href={part[1].href}
                                    tooltip={source.title + ' (' + (source.score > 0 ? '+' + source.score : source.score) + ')'}
                                    target="_blank">
                                    {part[2]}
                                </LinkWithTooltip>
                            );
                        }
                    })}
                </p>
            );
        });
    },

    renderPart: function(part, neg, pos)
    {
        var relScore = part.score < 0 ? part.score / neg : part.score / pos;

        return (
            <div onMouseEnter={(e)=>this.isAuthenticated() && this.props.editable && this.setState({activePart:part})}
                onMouseLeave={(e)=>this.isAuthenticated() && this.props.editable && this.setState({activePart:null})}
                className={classNames({
                    'bill-part'          : true,
                    'bill-part-active'   : !this.props.editable || this.state.activePart == part,
                    'bill-part-inactive' : !!this.state.activePart && this.state.activePart != part
                })}>
                {part.content != '[]' && !this.props.editable
                    ? <div className="bill-part-relative-score">
                        <div style={{
                            position: 'absolute',
                            left: (relScore * -100) + 'px',
                            height: '100%',
                            backgroundColor: part.score > 0 ? '#4285F4' : '#EB6864',
                            width: (relScore * 100) + 'px',
                        }}/>
                    </div>
                    : <div/>}
                {this.renderHeader(part.title, part.level)}
                {part.content != '[]'
                    ? <LikeButtons likeAction={BillAction.likeBillPart} resource={part}
                        editable={this.props.editable} showScore={!this.props.editable}
                        scoreFormat={(score) => score > 0 ? '+' + score : score}/>
                    : <div/>}
                {this.renderContent(JSON.parse(part.content))}
            </div>
        );
    },

    render: function()
    {
        var neg = 0;
        var pos = 0;
        for (var part of this.props.bill.parts)
        {
            if (part.score < 0)
                neg += part.score;
            if (part.score > 0)
                pos += part.score;
        }

		return (
            <div>
                {this.props.bill.parts.map((part) => this.renderPart(part, neg, pos))}
            </div>
        );
	}
});
